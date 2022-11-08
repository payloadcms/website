import { BANNER, BLOG_CONTENT, BLOG_MARKDOWN, CODE_BLOCK, MEDIA_BLOCK } from './blocks'
import { MEDIA_FIELDS } from './media'
import { META_FIELDS } from './meta'

export const POSTS = `
  query Posts {
    Posts(limit: 300 sort: "-publishedOn") {
      docs {
        id
        title
        image ${MEDIA_FIELDS}
        meta ${META_FIELDS}
        createdAt
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
        image {
          alt
          url
          height
          width
          filename
          mimeType
        }
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
