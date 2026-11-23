/**
 * Shared server-side GitHub client for Netlify Functions.
 *
 * SECURITY: GITHUB_TOKEN is read ONLY here, on the server. It is never placed
 * in a response, a log, or a VITE_ environment variable.
 */

const REST_BASE = 'https://api.github.com'
export const GRAPHQL_URL = `${REST_BASE}/graphql`
const DEFAULT_USERNAME = 'roshancodestorm'

export const REST_TTL_MS = 10 * 60 * 1000
export const GRAPHQL_TTL_MS = 30 * 60 * 1000

// Per-instance memory cache. Netlify warms instances, so this avoids repeat
// upstream calls. Stale entries are reused only when GitHub rate-limits us.
const cache = new Map()
const inflight = new Map()

function normalizeUsername(value) {
  const cleaned = String(value || '').trim()
  return /^[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i.test(cleaned)
    ? cleaned
    : DEFAULT_USERNAME
}

export function getGithubConfig() {
  return {
    token: (process.env.GITHUB_TOKEN || '').trim(),
    username: normalizeUsername(process.env.GITHUB_USERNAME || DEFAULT_USERNAME),
  }
}

function numeric(value) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function extractRateLimit(headers) {
  const remaining = numeric(headers.get('x-ratelimit-remaining'))
  const limit = numeric(headers.get('x-ratelimit-limit'))
  const resetSeconds = numeric(headers.get('x-ratelimit-reset'))
  const retryAfterHeader = numeric(headers.get('retry-after'))
  const resetInSeconds = resetSeconds
    ? Math.max(0, resetSeconds - Math.floor(Date.now() / 1000))
    : null

  return {
    remaining,
    limit,
    resetInSeconds,
    retryAfter:
      retryAfterHeader ??
      (remaining === 0 && resetInSeconds !== null ? resetInSeconds : null),
  }
}

function isRateLimited(response, rateLimit) {
  return (
    response.status === 429 ||
    (response.status === 403 &&
      (rateLimit.remaining === 0 || rateLimit.retryAfter !== null))
  )
}

function hash(value) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0
  }
  return String(h >>> 0)
}

function makeCacheKey(key, token, method, body) {
  return `${key}:${token ? 'auth' : 'anon'}:${method}:${body ? hash(body) : '-'}`
}

function upstreamError(code, message, extra = {}) {
  const error = new Error(message)
  Object.assign(error, { code }, extra)
  return error
}

async function runCached(id, ttlMs, task) {
  const hit = cache.get(id)
  if (hit && Date.now() < hit.expires) {
    return { data: hit.data, rateLimit: hit.rateLimit, fromCache: true, stale: false }
  }

  if (inflight.has(id)) return inflight.get(id)

  const pending = (async () => {
    try {
      const { data, rateLimit } = await task()
      cache.set(id, { data, rateLimit, expires: Date.now() + ttlMs })
      return { data, rateLimit, fromCache: false, stale: false }
    } catch (error) {
      // A stale cached response is better than a hard failure during a
      // short rate-limit window. It is flagged in the response metadata.
      if (error?.code === 'RATE_LIMITED' && hit) {
        return { data: hit.data, rateLimit: hit.rateLimit, fromCache: true, stale: true }
      }
      throw error
    } finally {
      inflight.delete(id)
    }
  })()

  inflight.set(id, pending)
  return pending
}

export async function githubRequest({
  path,
  url,
  method = 'GET',
  body,
  key,
  ttlMs = REST_TTL_MS,
}) {
  const { token } = getGithubConfig()
  const target = url || `${REST_BASE}${path}`
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'roshan-portfolio-github-activity',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  if (token) headers.Authorization = `Bearer ${token}`
  if (body) headers['Content-Type'] = 'application/json'

  const id = makeCacheKey(
    key || target,
    token,
    method,
    body ? JSON.stringify(body) : null,
  )

  return runCached(id, ttlMs, async () => {
    const signal =
      typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(12000) : undefined

    let response
    try {
      response = await fetch(target, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal,
      })
    } catch {
      throw upstreamError('NETWORK_ERROR', 'GitHub is temporarily unreachable.')
    }

    const rateLimit = extractRateLimit(response.headers)

    if (isRateLimited(response, rateLimit)) {
      throw upstreamError('RATE_LIMITED', 'GitHub rate limit reached.', {
        retryAfter: rateLimit.retryAfter,
      })
    }

    if (!response.ok) {
      throw upstreamError('UPSTREAM_ERROR', 'GitHub request failed.', {
        status: response.status,
      })
    }

    let data
    try {
      data = await response.json()
    } catch {
      throw upstreamError('BAD_RESPONSE', 'GitHub returned an invalid response.')
    }

    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      throw upstreamError('GRAPHQL_ERROR', 'GitHub GraphQL query failed.')
    }

    return { data, rateLimit }
  })
}

export function summarizeRateLimit(results) {
  const rates = results
    .filter((result) => result?.status === 'fulfilled')
    .map((result) => result.value.rateLimit)
    .filter(Boolean)

  const remaining = rates.map((r) => r.remaining).filter(Number.isFinite)
  const retryAfter = rates.map((r) => r.retryAfter).filter(Number.isFinite)

  return {
    remaining: remaining.length ? Math.min(...remaining) : null,
    retryAfter: retryAfter.length ? Math.max(...retryAfter) : null,
  }
}

export function json(body, statusCode = 200, options = {}) {
  const cacheControl =
    options.cache === false
      ? 'no-store'
      : `public, max-age=0, s-maxage=${options.sMaxage ?? 300}, stale-while-revalidate=${options.stale ?? 600}`

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': cacheControl,
      'X-Content-Type-Options': 'nosniff',
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
  }
}

export function methodNotAllowed() {
  return json({ error: 'METHOD_NOT_ALLOWED' }, 405, {
    cache: false,
    headers: { Allow: 'GET' },
  })
}

export function failure(error) {
  if (error?.code === 'RATE_LIMITED') {
    const retryAfter = error.retryAfter || 60
    return json(
      {
        error: 'RATE_LIMITED',
        message: 'GitHub rate limit reached. Please try again shortly.',
        retryAfter,
      },
      429,
      { cache: false, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  return json(
    { error: 'UPSTREAM_ERROR', message: 'GitHub data is temporarily unavailable.' },
    502,
    { cache: false },
  )
}
