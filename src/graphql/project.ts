const PROJECT = `
  id
  slug
  status
  team {
    id
    slug
    name
  }
  name
  installScript
  buildScript
  repositoryFullName
  deploymentBranch
  stripeSubscriptionStatus
  plan {
    name
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
