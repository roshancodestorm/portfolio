import { useEffect, useState } from 'react'
import {
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaUsers,
  FaExternalLinkAlt,
  FaSync,
  FaExclamationTriangle,
  FaCode,
  FaCalendarAlt,
} from 'react-icons/fa'
import SectionHeader from '../ui/SectionHeader'
import Reveal from '../ui/Reveal'
import { LINKS } from '../../config/site'
import { fetchGitHubActivity } from '../../utils/github'

const formatNumber = (value) =>
  typeof value === 'number' ? new Intl.NumberFormat('en-US').format(value) : '—'

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

const HEATMAP_MESSAGES = {
  TOKEN_REQUIRED:
    'The contribution heatmap turns on when GITHUB_TOKEN is set in Netlify. Public REST activity above is still live.',
  RATE_LIMITED:
    'GitHub is rate-limiting contribution requests right now. The heatmap will return automatically.',
  GRAPHQL_UNAVAILABLE:
    'Contribution data needs a token with GitHub GraphQL access. No estimates are shown instead.',
  NO_CONTRIBUTION_DATA:
    'GitHub did not return a contribution calendar for this account.',
}

export default function GitHubActivity({ sectionId }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true

    fetchGitHubActivity({ signal: controller.signal })
      .then((result) => {
        if (!mounted) return
        if (!result.rest && !result.graphql) {
          setStatus('error')
          return
        }
        setData(result)
        setStatus('ready')
      })
      .catch(() => {
        if (mounted) setStatus('error')
      })

    return () => {
      mounted = false
      controller.abort()
    }
  }, [attempt])

  return (
    <section
      id={sectionId}
      className="relative scroll-section border-b-3 border-ink py-24 max-md:py-16"
    >
      <div className="section-shell">
        <Reveal>
          <SectionHeader
            eyebrow="Live from GitHub"
            title="Developer"
            accent="Activity"
            right={
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bl-btn bl-btn-dark h-11 !px-4 text-[12.5px]"
              >
                <FaGithub aria-hidden="true" /> View profile
              </a>
            }
          />
        </Reveal>

        {status === 'loading' && <LoadingState />}

        {status === 'error' && (
          <ErrorState
            onRetry={() => {
              setStatus('loading')
              setAttempt((value) => value + 1)
            }}
          />
        )}

        {status === 'ready' && data && <ActivityContent data={data} />}
      </div>
    </section>
  )
}

function ActivityContent({ data }) {
  const { rest, graphql } = data
  const heatmapAvailable = Boolean(graphql?.available && graphql.weeks?.length)

  return (
    <div className="flex flex-col gap-10">
      {heatmapAvailable ? (
        <ContributionPanel graphql={graphql} />
      ) : (
        <UnavailablePanel graphql={graphql} />
      )}

      {rest ? (
        <>
          <StatsPanel rest={rest} />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <CommitsPanel commits={rest.recentCommits || []} />
            <PullRequestsPanel pullRequests={rest.recentPullRequests || []} />
          </div>
          <RepositoriesPanel repositories={rest.repositories || []} />
          <p className="text-center font-display text-[11px] font-bold tracking-[0.12em] text-inkmuted uppercase">
            {rest.authenticated
              ? 'Live data · authenticated GitHub API'
              : 'Live data · public GitHub API'}
            {rest.cache?.stale ? ' · serving cached data during rate limit' : ''}
          </p>
        </>
      ) : (
        <div className="bl-card-cream border-2 border-dashed border-ink/40 p-6 text-center text-[13px] text-inkmuted">
          Repository statistics, commits, and pull requests are temporarily unavailable.
        </div>
      )}
    </div>
  )
}

function ContributionPanel({ graphql }) {
  const total = graphql.totalContributions
  const days = graphql.weeks.flatMap((week) => week.contributionDays || [])

  return (
    <div className="bl-card p-6 max-md:p-5">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-[12px] font-bold tracking-[0.16em] text-inkmuted uppercase">
            Contributions · last 12 months
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-ink">
            {formatNumber(total)} <span className="text-[15px] text-inkmuted">contributions</span>
          </p>
        </div>
        <span className="bl-tag bg-mint !text-[11px]">
          <FaCalendarAlt aria-hidden="true" /> {formatDate(graphql.range?.from)} – {formatDate(graphql.range?.to)}
        </span>
      </div>

      <div className="gh-heatmap-scroll" role="img" aria-label={`Contribution heatmap with ${formatNumber(total)} contributions`}>
        <div className="gh-heatmap" aria-hidden="true">
          {graphql.weeks.map((week, weekIndex) =>
            (week.contributionDays || []).map((day) => (
              <span
                key={`${weekIndex}-${day.date}`}
                className={`gh-cell gh-level-${day.level}`}
                title={`${day.date}: ${day.count} contribution${day.count === 1 ? '' : 's'}`}
              />
            )),
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-[11px] font-bold text-inkmuted">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => (
          <span key={level} className={`gh-cell gh-level-${level}`} aria-hidden="true" />
        ))}
        <span>More</span>
      </div>
      <p className="sr-only">
        {days.length} contribution days loaded from GitHub GraphQL.
      </p>
    </div>
  )
}

function UnavailablePanel({ graphql }) {
  const reason = graphql?.reason
  const message =
    HEATMAP_MESSAGES[reason] ||
    (reason
      ? 'Contribution data is unavailable right now.'
      : 'Contribution data is temporarily unavailable.')

  return (
    <div className="bl-card-cream flex flex-col gap-3 border-2 border-dashed border-ink/40 p-6 max-md:p-5">
      <div className="flex items-center gap-2 font-display text-[12px] font-bold tracking-[0.16em] text-inkmuted uppercase">
        <FaCalendarAlt aria-hidden="true" /> Contribution heatmap
      </div>
      <p className="text-[14px] leading-relaxed text-inkmuted">{message}</p>
    </div>
  )
}

function StatsPanel({ rest }) {
  const stats = rest.stats || {}
  const cards = [
    { label: 'Public repositories', value: stats.publicRepos, icon: FaGithub, accent: 'bg-cyan' },
    { label: 'Stars earned', value: stats.totalStars, icon: FaStar, accent: 'bg-sun' },
    { label: 'Followers', value: stats.followers, icon: FaUsers, accent: 'bg-mint' },
    { label: 'Forks', value: stats.totalForks, icon: FaCodeBranch, accent: 'bg-peach' },
  ]

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {rest.profile?.avatarUrl && (
          <img
            src={rest.profile.avatarUrl}
            alt=""
            loading="lazy"
            className="h-12 w-12 rounded-full border-3 border-ink bg-white shadow-[3px_3px_0_#111827]"
          />
        )}
        <div>
          <h3 className="font-display text-lg font-bold text-ink">
            {rest.profile?.name || `@${rest.username}`}
          </h3>
          <p className="font-display text-[12px] font-bold text-inkmuted">@{rest.profile?.login || rest.username}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, accent }) => (
          <article key={label} className="lift-card bl-card flex items-center gap-3 p-4 max-sm:p-3">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border-3 border-ink ${accent}`}>
              <Icon aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-[11px] font-bold tracking-wide text-inkmuted uppercase">
                {label}
              </p>
              <p className="font-display text-xl font-bold text-ink">{formatNumber(value)}</p>
            </div>
          </article>
        ))}
      </div>

      {stats.topLanguages?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {stats.topLanguages.map((language) => (
            <span key={language.name} className="bl-tag bg-softblue !text-[11px]">
              {language.name} · {language.count}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function CommitsPanel({ commits }) {
  return (
    <div className="bl-card flex h-full flex-col p-6 max-md:p-5">
      <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
        <FaCode aria-hidden="true" /> Recent commits
      </h3>
      {commits.length === 0 ? (
        <EmptyMessage>No public push events in the GitHub activity window.</EmptyMessage>
      ) : (
        <ul className="flex flex-col gap-3">
          {commits.slice(0, 6).map((commit) => (
            <li key={commit.sha}>
              <a
                href={commit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 rounded-lg border-2 border-ink bg-white px-3 py-2 shadow-[3px_3px_0_#111827] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px]"
              >
                <span className="line-clamp-2 text-[13px] font-bold text-ink">{commit.message || 'Commit'}</span>
                <span className="flex flex-wrap items-center gap-2 font-display text-[11px] text-inkmuted">
                  <span className="font-bold text-coral">{commit.repo}</span>
                  <span>·</span>
                  <time dateTime={commit.date}>{formatDate(commit.date)}</time>
                  <FaExternalLinkAlt aria-hidden="true" className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function PullRequestsPanel({ pullRequests }) {
  return (
    <div className="bl-card flex h-full flex-col p-6 max-md:p-5">
      <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
        <FaCodeBranch aria-hidden="true" /> Pull requests
      </h3>
      {pullRequests.length === 0 ? (
        <EmptyMessage>No recent public pull requests found.</EmptyMessage>
      ) : (
        <ul className="flex flex-col gap-3">
          {pullRequests.slice(0, 6).map((pr) => (
            <li key={`${pr.repo}-${pr.number}`}>
              <a
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 rounded-lg border-2 border-ink bg-white px-3 py-2 shadow-[3px_3px_0_#111827] transition-transform hover:-translate-x-[1px] hover:-translate-y-[1px]"
              >
                <span className="line-clamp-2 text-[13px] font-bold text-ink">{pr.title}</span>
                <span className="flex flex-wrap items-center gap-2 font-display text-[11px] text-inkmuted">
                  <span className={`bl-tag !px-1.5 !py-0 !text-[10px] ${pr.mergedAt ? 'bg-mint' : 'bg-peach'}`}>
                    {pr.mergedAt ? 'Merged' : pr.state}
                  </span>
                  <span className="font-bold text-coral">{pr.repo}</span>
                  <span>·</span>
                  <time dateTime={pr.createdAt}>{formatDate(pr.createdAt)}</time>
                  <FaExternalLinkAlt aria-hidden="true" className="ml-auto opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function RepositoriesPanel({ repositories }) {
  if (repositories.length === 0) return null

  return (
    <div>
      <h3 className="mb-5 font-display text-lg font-bold text-ink">Top repositories</h3>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {repositories.slice(0, 6).map((repo) => (
          <a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lift-card bl-card flex h-full flex-col gap-2 p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-display text-[15px] font-bold text-ink">{repo.name}</h4>
              <FaExternalLinkAlt aria-hidden="true" className="mt-0.5 shrink-0 text-inkmuted" />
            </div>
            <p className="line-clamp-2 flex-1 text-[12.5px] leading-relaxed text-inkmuted">
              {repo.description || 'No description provided.'}
            </p>
            <div className="flex flex-wrap items-center gap-3 font-display text-[11px] font-bold text-ink">
              {repo.language && <span className="bl-tag bg-softblue !text-[10px]">{repo.language}</span>}
              <span className="flex items-center gap-1"><FaStar aria-hidden="true" /> {formatNumber(repo.stars)}</span>
              <span className="flex items-center gap-1"><FaCodeBranch aria-hidden="true" /> {formatNumber(repo.forks)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function EmptyMessage({ children }) {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-ink/30 p-8 text-center text-[13px] text-inkmuted">
      {children}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex flex-col gap-8" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading live GitHub activity…</span>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="bl-card h-24 animate-pulse bg-white" />
        ))}
      </div>
      <div className="bl-card h-44 animate-pulse bg-white" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bl-card h-64 animate-pulse bg-white" />
        <div className="bl-card h-64 animate-pulse bg-white" />
      </div>
    </div>
  )
}

function ErrorState({ onRetry }) {
  return (
    <div className="bl-card p-12 text-center" role="alert">
      <FaExclamationTriangle aria-hidden="true" className="mx-auto mb-4 text-3xl text-coral" />
      <h3 className="font-display text-xl font-bold text-ink">Could not load GitHub activity</h3>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-inkmuted">
        The live GitHub endpoints did not respond. Nothing is fabricated — please try again.
      </p>
      <button type="button" onClick={onRetry} className="bl-btn bl-btn-coral mt-6 h-11 !px-5 text-[13px]">
        <FaSync aria-hidden="true" /> Try again
      </button>
    </div>
  )
}
