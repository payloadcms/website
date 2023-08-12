export const PLAN = `
  id
  slug
  name
  priceJSON
`

export const PLANS_QUERY = `
query Plan {
  Plans(sort: "order", limit: 300) {
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
