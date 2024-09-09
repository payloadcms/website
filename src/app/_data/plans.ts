export const PLAN = `
  id
  slug
  name
  priceJSON
  description
  highlight
  private
  features {
    icon
    feature
  }
`

export const PLANS_QUERY = `
query Plan {
  Plans(sort: "order", limit: 300, where: { private: { not_equals: true } } ) {
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
