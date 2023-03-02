export const PROJECTS = `
  query Project($teamID: String $projectSlug: String) {
    Projects(where: { slug: { equals: $projectSlug }, team: { equals: $teamID } }) {
      docs {
        id
        slug
        name
        installScript
        buildScript
        deploymentBranch
        environmentVariables {
          id
          name
          value
        }
      }
    }
  }
`
