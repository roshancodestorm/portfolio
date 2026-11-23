/**
 * Netlify Function — GitHub GraphQL contributionsCollection.
 *
 * Frontend: GET /api/github-graphql
 * The contribution heatmap requires an authenticated GraphQL call, so when
 * GITHUB_TOKEN is not configured this returns an explicit unavailable state.
 * No contribution numbers are invented or derived from unrelated endpoints.
 */
import {
  getGithubConfig,
  githubRequest,
  json,
  methodNotAllowed,
  GRAPHQL_URL,
  GRAPHQL_TTL_MS,
} from './lib/github.js'

const CONTRIBUTIONS_QUERY = `
  query PortfolioContributions($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      login
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

function unavailable(reason, message, username, { headers, ...extra } = {}) {
  return json(
    {
      source: 'github-graphql',
      available: false,
      reason,
      message,
      username,
      generatedAt: new Date().toISOString(),
      ...extra,
    },
    200,
    { cache: false, headers },
  )
}

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return methodNotAllowed()

  const { token, username } = getGithubConfig()

  if (!token) {
    return unavailable(
      'TOKEN_REQUIRED',
      'Contribution heatmap is available when GITHUB_TOKEN is configured in Netlify.',
      username,
    )
  }

  const to = new Date()
  const from = new Date(to.getTime() - 364 * 24 * 60 * 60 * 1000)

  try {
    const { data, fromCache, stale, rateLimit } = await githubRequest({
      url: GRAPHQL_URL,
      method: 'POST',
      key: `contributions:${username}`,
      ttlMs: GRAPHQL_TTL_MS,
      body: {
        query: CONTRIBUTIONS_QUERY,
        variables: {
          login: username,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      },
    })

    const user = data?.user
    const calendar = user?.contributionsCollection?.contributionCalendar
    if (!user || !calendar || !Array.isArray(calendar.weeks)) {
      return unavailable('NO_CONTRIBUTION_DATA', 'No contribution calendar was returned for this user.', username)
    }

    const weeks = calendar.weeks.map((week) => ({
      contributionDays: (week.contributionDays || []).map((day) => ({
        date: day.date,
        count: day.contributionCount ?? 0,
        level: LEVELS[day.contributionLevel] ?? 0,
      })),
    }))

    return json(
      {
        source: 'github-graphql',
        available: true,
        generatedAt: new Date().toISOString(),
        username: user.login || username,
        totalContributions: calendar.totalContributions ?? null,
        range: { from: from.toISOString(), to: to.toISOString() },
        weeks,
        cache: { fromCache, stale },
        rateLimit,
      },
      200,
      { sMaxage: 600 },
    )
  } catch (error) {
    // Log only a safe code — never the token, headers, or raw upstream body.
    console.warn('[github-graphql] request failed:', error?.code || 'UNKNOWN')

    if (error?.code === 'RATE_LIMITED') {
      return unavailable(
        'RATE_LIMITED',
        'GitHub is rate-limiting contribution requests right now.',
        username,
        {
          retryAfter: error.retryAfter || null,
          headers: error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : {},
        },
      )
    }

    return unavailable(
      'GRAPHQL_UNAVAILABLE',
      'Contribution data needs a token with GitHub GraphQL access.',
      username,
    )
  }
}
