import { BANNER, BLOG_CONTENT, CODE_BLOCK, MEDIA_BLOCK } from './blocks'
import { FOOTER, MAIN_MENU } from './globals'

export const POSTS = `
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
        layout {
          ${BLOG_CONTENT}
          ${BANNER}
          ${CODE_BLOCK}
          ${MEDIA_BLOCK}
        }
      }
    }

    ${MAIN_MENU}
    ${FOOTER}
  }
`
