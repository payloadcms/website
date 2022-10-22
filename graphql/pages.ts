import { gql } from "@apollo/client";
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
          ...on CalltoAction {
            blockType
            richText
            feature
            ctaLinks: links {
              link ${LINK_FIELDS({ disableAppearance: true })}
            }
          }
          ...on CardGrid {
            richText
            cardGridLinks: links {
              link ${LINK_FIELDS({ disableAppearance: true })}
            }
            cards {
              title
              description
              link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
            }
          }
        }
      }
    }

    ${MAIN_MENU}
    ${FOOTER}
  }
`