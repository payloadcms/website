export const TEMPLATE_FIELDS = `
  id
  name
  slug
  description
  templateRepo
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
`

export const TEMPLATES = `
  query {
    Templates {
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
  query Template($slug: String ) {
    Templates(where: { slug: { equals: $slug} }, draft: true) {
      docs {
        ${TEMPLATE_FIELDS}
      }
    }
  }
`
