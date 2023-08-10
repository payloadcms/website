export const PLAN = `
  id
  slug
  name
  priceJSON
`

export const PLANS_QUERY = `
query Plan {
  Plans {
    docs {
      ${PLAN}
    }
    totalDocs
    totalPages
    page
    limit
  }
}
`
