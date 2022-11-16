import { BANNER, BLOG_CONTENT, BLOG_MARKDOWN, CODE_BLOCK, MEDIA_BLOCK } from './blocks'
import { MEDIA_FIELDS } from './media'
import { META_FIELDS } from './meta'

export const POSTS = `
  query Posts($publishedOn: DateTime) {
    Posts(where: { publishedOn: { less_than_equal: $publishedOn} }, limit: 300 sort: "-publishedOn") {
      docs {
        id
        title
        image ${MEDIA_FIELDS}
        meta ${META_FIELDS}
        createdAt
        publishedOn
        slug
      }
    }
  }
`

export const POST_SLUGS = `
  query Posts {
    Posts(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const POST = `
  query Post($slug: String ) {
    Posts(where: { slug: { equals: $slug} }, draft: true) {
      docs {
        id
        title
        image ${MEDIA_FIELDS}
        excerpt
        author {
          firstName
          lastName
          email
          photo {
            alt
            url
            height
            width
            filename
            mimeType
          }
        }
        createdAt
        publishedOn
        content {
          ${BLOG_CONTENT}
          ${BLOG_MARKDOWN}
          ${BANNER}
          ${CODE_BLOCK}
          ${MEDIA_BLOCK}
        }
        meta ${META_FIELDS}
      }
    }
  }
`
