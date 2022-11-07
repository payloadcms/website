import { BANNER, BLOG_CONTENT, BLOG_MARKDOWN, CODE_BLOCK, MEDIA_BLOCK } from './blocks'

export const POSTS = `
  query Posts {
    Posts(limit: 300) {
      docs {
        id
        title
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
        content {
          ${BLOG_CONTENT}
          ${BLOG_MARKDOWN}
          ${BANNER}
          ${CODE_BLOCK}
          ${MEDIA_BLOCK}
        }
      }
    }
  }
`
