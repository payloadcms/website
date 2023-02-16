export const PROJECTS = `
  query Project($teamID: String $projectSlug: String) {
    Projects(where: { slug: { equals: $projectSlug }, owner: { equals: $teamID } }) {
      docs {
        id
        name
        slug
      }
    }
  }
`
