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
    Pages(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PAGE = `
  query Page($slug: String ) {
    Pages(where: { slug: { equals: $slug} }, draft: true) {
      docs {
        id
        title
        hero {
          type
          pageLabel
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
          ${REUSABLE_CONTENT_BLOCK}
          ${SLIDER}
          ${STEPS}
          ${STICKY_HIGHLIGHTS}
        }
        meta ${META_FIELDS}
      }
    }
  }
`
