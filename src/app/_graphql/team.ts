export const TEAM = `id
name
slug
stripeCustomerID
billingEmail
members {
  user {
    id
    email
  }
  roles
  joinedOn
}`

export const TEAM_QUERY = `
  query Team($slug: String) {
    Teams(where: { slug: { equals: $slug } }, limit: 1) {
      docs {
        ${TEAM}
      }
    }
  }
`

export const TEAMS = `
  query Teams {
    Teams(limit: 300) {
      docs {
        ${TEAM}
      }
    }
  }
`
