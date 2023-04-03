export const TEAMS = `
  query Team($slug: String) {
    Teams(where: { slug: { equals: $slug} }) {
      docs {
        id
        name
        slug
        stripeCustomerID
        members {
          user {
            id
            email
          }
          roles
          joinedOn
        }
      }
    }
  }
`
