import { GITHUB_REST_ENDPOINT, GITHUB_GRAPHQL_ENDPOINT } from '../config/site'

async function getJson(url, signal) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!response.ok) {
    throw new Error(`GitHub endpoint returned ${response.status}`)
  }
  return response.json()
}

/**
 * Fetches both serverless endpoints independently so one unavailable source
 * never blanks out the other. No token is ever handled here.
 */
export async function fetchGitHubActivity({ signal } = {}) {
  const [rest, graphql] = await Promise.allSettled([
    getJson(GITHUB_REST_ENDPOINT, signal),
    getJson(GITHUB_GRAPHQL_ENDPOINT, signal),
  ])

  const errors = []
  if (rest.status === 'rejected') errors.push('REST')
  if (graphql.status === 'rejected') errors.push('GraphQL')

  return {
    rest: rest.status === 'fulfilled' ? rest.value : null,
    graphql: graphql.status === 'fulfilled' ? graphql.value : null,
    errors,
  }
}
