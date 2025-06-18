export const TEAM = `id
name
slug
stripeCustomerID
billingEmail
isEnterprise
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

export const TEAMS_QUERY = `
  query Team($teamIDs: [String!], $page: Int, $limit: Int, $search: String) {
    Teams(where: { AND: [{ id: { in: $teamIDs } }], OR: [{ name: { like: $search } }, { slug: { like: $search } }] }, limit: $limit, page: $page) {
      docs {
        ${TEAM}
      }
    }
  }
`
