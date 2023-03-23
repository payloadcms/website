export const PROJECTS = `
  query Project($teamID: String $projectSlug: String) {
    Projects(where: { slug: { equals: $projectSlug }, team: { equals: $teamID } }) {
      docs {
        id
        slug
        team {
          id
          slug
          name
        }
        name
        installScript
        buildScript
        deploymentBranch
        environmentVariables {
          id
          key
          value
        }
      }
    }
  }
`
