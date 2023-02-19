export const PROJECTS = `
  query Project($teamID: String $projectSlug: String) {
    Projects(where: { slug: { equals: $projectSlug }, team: { equals: $teamID } }) {
      docs {
        id
        name
        slug
      }
    }
  }
`
