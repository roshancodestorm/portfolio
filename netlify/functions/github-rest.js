/**
 * Netlify Function — public GitHub REST data.
 *
 * Frontend: GET /api/github-rest
 * Returns a whitelisted subset of public profile, repository, commit and PR
 * data. GITHUB_TOKEN, when set in Netlify, is used only server-side to raise
 * rate limits. Without it the same public REST endpoints are called anonymously.
 */
import {
  getGithubConfig,
  githubRequest,
  json,
  methodNotAllowed,
  failure,
  summarizeRateLimit,
  REST_TTL_MS,
} from './lib/github.js'

const PROFILE_FIELDS = (profile) => ({
  login: profile.login,
  name: profile.name || profile.login,
  avatarUrl: profile.avatar_url,
  profileUrl: profile.html_url,
  bio: profile.bio || '',
  publicRepos: profile.public_repos ?? null,
  followers: profile.followers ?? null,
  following: profile.following ?? null,
  createdAt: profile.created_at || null,
})

const REPO_FIELDS = (repo) => ({
  name: repo.name,
  description: repo.description || '',
  url: repo.html_url,
  stars: repo.stargazers_count ?? 0,
  forks: repo.forks_count ?? 0,
  openIssues: repo.open_issues_count ?? 0,
  language: repo.language || null,
  topics: (repo.topics || []).slice(0, 6),
  updatedAt: repo.updated_at || null,
  isFork: Boolean(repo.fork),
})

function buildStats(profile, repos, reposAvailable) {
  const owned = repos.filter((repo) => !repo.fork)
  const languageCounts = owned.reduce((acc, repo) => {
    if (!repo.language) return acc
    acc[repo.language] = (acc[repo.language] || 0) + 1
    return acc
  }, {})

  return {
    publicRepos: profile?.public_repos ?? (reposAvailable ? repos.length : null),
    followers: profile?.followers ?? null,
    following: profile?.following ?? null,
    totalStars: reposAvailable
      ? owned.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
      : null,
    totalForks: reposAvailable
      ? owned.reduce((sum, repo) => sum + (repo.forks_count || 0), 0)
      : null,
    openIssues: reposAvailable
      ? owned.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0)
      : null,
    topLanguages: Object.entries(languageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count })),
  }
}

function buildCommits(events, username) {
  const seen = new Set()
  return events
    .filter((event) => event.type === 'PushEvent' && Array.isArray(event.payload?.commits))
    .flatMap((event) =>
      event.payload.commits.map((commit) => ({
        sha: commit.sha,
        message: String(commit.message || '').split('\n')[0].slice(0, 160),
        repo: event.repo?.name || '',
        url: `https://github.com/${event.repo?.name}/commit/${commit.sha}`,
        date: event.created_at,
        pusher: event.payload.pusher || username,
      })),
    )
    .filter((commit) => {
      if (!commit.sha || !/^[0-9a-f]{7,40}$/i.test(commit.sha) || !commit.repo) return false
      if (seen.has(commit.sha)) return false
      seen.add(commit.sha)
      return true
    })
    .slice(0, 12)
}

function buildPullRequests(items) {
  return items.map((item) => ({
    number: item.number,
    title: String(item.title || '').slice(0, 160),
    state: item.state,
    url: item.html_url,
    repo: item.repository_url ? item.repository_url.split('/').slice(-2).join('/') : '',
    createdAt: item.created_at,
    mergedAt: item.pull_request?.merged_at || null,
    author: item.user?.login || null,
  }))
}

function valueOf(result) {
  return result?.status === 'fulfilled' ? result.value : null
}

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') return methodNotAllowed()

  const { token, username } = getGithubConfig()
  const encoded = encodeURIComponent(username)
  const prQuery = encodeURIComponent(`author:${username} type:pr is:public`)

  const requests = [
    githubRequest({ path: `/users/${encoded}`, key: `profile:${username}`, ttlMs: REST_TTL_MS }),
    githubRequest({
      path: `/users/${encoded}/repos?per_page=100&sort=updated&type=owner`,
      key: `repos:${username}`,
      ttlMs: REST_TTL_MS,
    }),
    githubRequest({
      path: `/users/${encoded}/events/public?per_page=100`,
      key: `events:${username}`,
      ttlMs: REST_TTL_MS,
    }),
    githubRequest({
      path: `/search/issues?q=${prQuery}&sort=created&order=desc&per_page=10`,
      key: `prs:${username}`,
      ttlMs: REST_TTL_MS,
    }),
  ]

  const settled = await Promise.allSettled(requests)
  const [profileResult, reposResult, eventsResult, prResult] = settled

  const allFailed = settled.every((result) => result.status === 'rejected')
  if (allFailed) {
    const rateLimited = settled.some((result) => result.reason?.code === 'RATE_LIMITED')
    console.warn('[github-rest] all upstream requests failed:', settled[0].reason?.code || 'UNKNOWN')
    return failure(rateLimited ? { code: 'RATE_LIMITED', retryAfter: 60 } : settled[0].reason)
  }

  const profile = valueOf(profileResult)?.data || null
  const repos = valueOf(reposResult)?.data
  const events = valueOf(eventsResult)?.data
  const prItems = valueOf(prResult)?.data?.items

  const reposAvailable = Array.isArray(repos)
  const eventsAvailable = Array.isArray(events)
  const prsAvailable = Array.isArray(prItems)

  const topRepos = reposAvailable
    ? [...repos]
        .filter((repo) => !repo.fork)
        .sort((a, b) => {
          const starDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0)
          if (starDiff) return starDiff
          return String(b.updated_at || '').localeCompare(String(a.updated_at || ''))
        })
        .slice(0, 6)
        .map(REPO_FIELDS)
    : []

  const payload = {
    source: 'github-rest',
    generatedAt: new Date().toISOString(),
    username,
    authenticated: Boolean(token),
    profile: profile ? PROFILE_FIELDS(profile) : null,
    stats: buildStats(profile, reposAvailable ? repos : [], reposAvailable),
    repositories: topRepos,
    recentCommits: eventsAvailable ? buildCommits(events, username) : [],
    recentPullRequests: prsAvailable ? buildPullRequests(prItems) : [],
    availability: {
      profile: Boolean(profile),
      repositories: reposAvailable,
      commits: eventsAvailable,
      pullRequests: prsAvailable,
    },
    cache: {
      fromCache: settled.some((r) => r.status === 'fulfilled' && r.value.fromCache),
      stale: settled.some((r) => r.status === 'fulfilled' && r.value.stale),
    },
    rateLimit: summarizeRateLimit(settled),
  }

  return json(payload, 200, { sMaxage: 300 })
}
