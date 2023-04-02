export const TEAMS = `
  query Team($slug: String) {
    Teams(where: { slug: { equals: $slug} }) {
      docs {
        id
        name
        slug
        stripeCustomerID
      }
    }
  }
`
