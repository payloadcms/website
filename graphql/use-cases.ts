import {
  CALL_TO_ACTION,
  CARD_GRID,
  CASE_STUDIES_HIGHLIGHT,
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
import { LINK_FIELDS } from './link'
import { MEDIA_FIELDS } from './media'
import { META_FIELDS } from './meta'

export const USE_CASES = `
  query UseCases {
    UseCases(limit: 300) {
      docs {
        id
        title
        createdAt
        slug
      }
    }
  }
`

export const USE_CASE = `
  query UseCase($slug: String ) {
    UseCases(where: { slug: { equals: $slug} }, draft: true) {
      docs {
        id
        title
        introContent
        featuredImage ${MEDIA_FIELDS}
        slug
        link ${LINK_FIELDS({ disableLabel: true, disableAppearance: true })}
        layout {
          ${CALL_TO_ACTION}
          ${CARD_GRID}
          ${CASE_STUDIES_HIGHLIGHT}
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
