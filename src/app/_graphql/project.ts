import { PLAN } from './plans'
import { TEAM } from './team'

const PROJECT = `
  id
  slug
  status
  team {
    ${TEAM}
  }
  region
  name
  repositoryFullName
  makePrivate
  stripeSubscriptionStatus
  installID
  repositoryID
  deploymentBranch
  outputDirectory
  buildScript
  installScript
  runScript
  rootDirectory
  defaultDomain
  infraStatus
  template {
    id
    name
    slug
  }
  plan {
    ${PLAN}
  }
  environmentVariables {
    id
    key
    value
  }
`

export const PROJECTS_QUERY = `
query Project($teamIDs: [String!], $page: Int, $limit: Int, $search: String) {
  Projects(where: { AND: [{ team: { in: $teamIDs } }], OR: [{ name: { like: $search } }, { slug: { like: $search } }] }, limit: $limit, page: $page) {
    docs {
      ${PROJECT}
    }
    totalDocs
    totalPages
    page
    limit
  }
}
`

export const PROJECT_QUERY = `
query Project($teamID: String, $projectSlug: String) {
  Projects(where: { AND: [{ slug: { equals: $projectSlug }}, { team: { equals: $teamID }} ] }, limit: 1) {
    docs {
      ${PROJECT}
    }
  }
}
`
