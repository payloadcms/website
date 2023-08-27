import {
  CALL_TO_ACTION,
  CARD_GRID,
  CASE_STUDIES_HIGHLIGHT,
  CASE_STUDY_CARDS,
  CODE_FEATURE,
  CONTENT,
  CONTENT_GRID,
  FORM_BLOCK,
  HOVER_HIGHLIGHTS,
  LINK_GRID,
  MEDIA_BLOCK,
  MEDIA_CONTENT,
  PRICING_BLOCK,
  REUSABLE_CONTENT_BLOCK,
  SLIDER,
  STEPS,
  STICKY_HIGHLIGHTS,
} from './blocks'
import { FORM_FIELDS } from './form'
import { LINK_FIELDS } from './link'
import { MEDIA_FIELDS } from './media'
import { META_FIELDS } from './meta'

export const PAGES = `
  query Pages {
    Pages(limit: 300, where: { slug: { not_equals: "cloud" } }) {
      docs {
        slug
        breadcrumbs {
          url
          label
        }
      }
    }
  }
`

export const PAGE = `
  query Page($slug: String, $draft: Boolean) {
    Pages(where: { slug: { equals: $slug } }, limit: 1, draft: $draft) {
      docs {
        id
        title
        hero {
          type
          richText
          sidebarContent
          links {
            link ${LINK_FIELDS()}
          }
          actions {
            link ${LINK_FIELDS({ disableAppearance: true })}
          }
          buttons {
            link ${LINK_FIELDS()}
          }
          media ${MEDIA_FIELDS}
          adjectives {
            adjective 
          }
          form ${FORM_FIELDS}
          livestream {
            id
            date
            richText
            guests {
              name
              link
              image {
                url
              }
            }
            hideBreadcrumbs
          }
        }
        layout {
          ${CALL_TO_ACTION}
          ${CARD_GRID}
          ${CASE_STUDIES_HIGHLIGHT}
          ${CASE_STUDY_CARDS}
          ${CODE_FEATURE}
          ${CONTENT}
          ${CONTENT_GRID}
          ${FORM_BLOCK}
          ${HOVER_HIGHLIGHTS}
          ${LINK_GRID}
          ${MEDIA_BLOCK}
          ${MEDIA_CONTENT}
          ${PRICING_BLOCK}
          ${REUSABLE_CONTENT_BLOCK}
          ${SLIDER}
          ${STEPS}
          ${STICKY_HIGHLIGHTS}
        }
        meta ${META_FIELDS}
        breadcrumbs {
          url
          label
        }
      }
    }
  }
`
