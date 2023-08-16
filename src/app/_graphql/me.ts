export const USER = `
  id
  name
  email
  roles
  teams {
    team {
      id
      name
      slug
      stripeCustomerID
    }
    roles
  }
`

export const ME_QUERY = `query {
  meUser {
    user {
      ${USER}
    }
    exp
  }
}`
