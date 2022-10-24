import { gql } from "@apollo/client";
import { CALL_TO_ACTION, CARD_GRID, CASE_STUDIES_HIGHLIGHT, CONTENT, CONTENT_GRID, FEATURE_HIGHLIGHT, FORM_BLOCK, LINK_GRID, MEDIA_BLOCK, MEDIA_CONTENT, REUSABLE_CONTENT_BLOCK } from "./blocks";
import { FOOTER, MAIN_MENU } from "./globals";
import { LINK_FIELDS } from "./link";

export const PAGES = gql`
  query Pages {
    Pages(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PAGE = gql`
  query Page($slug: String ) {
    Pages(where: { slug: { equals: $slug}}) {
      docs {
        id
        title
        hero {
          type
          richText
          links {
            link ${LINK_FIELDS()}
          }
          media {
            url
          }
        }
        layout {
          ${CALL_TO_ACTION}
          ${CARD_GRID}
          ${CASE_STUDIES_HIGHLIGHT}
          ${CONTENT}
          ${CONTENT_GRID}
          ${FEATURE_HIGHLIGHT}
          ${FORM_BLOCK}
          ${LINK_GRID}
          ${MEDIA_BLOCK}
          ${MEDIA_CONTENT}
          ${REUSABLE_CONTENT_BLOCK}
        }
      }
    }

    ${MAIN_MENU}
    ${FOOTER}
  }
`