export const TEMPLATE_FIELDS = `
  id
  name
  slug
  description
  templateRepo
  templateOwner
  templatePath
  order
  image {
    mimeType
    alt
    filename
    filesize
    url
    width
    height
  }
  adminOnly
`

export const TEMPLATES = `
  query {
    Templates(sort: "order", limit: 300) {
      docs {
        ${TEMPLATE_FIELDS}
      }
    }
  }
`

export const TEMPLATE_SLUGS = `
  query Templates {
    Templates(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const TEMPLATE = `
  query Template($slug: String) {
    Templates(where: { slug: { equals: $slug} }, draft: true, limit: 1) {
      docs {
        ${TEMPLATE_FIELDS}
      }
    }
  }
`
