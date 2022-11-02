import {
  CALL_TO_ACTION,
  CARD_GRID,
  CASE_STUDIES_HIGHLIGHT,
  CONTENT,
  CONTENT_GRID,
  FEATURE_HIGHLIGHT,
  FORM_BLOCK,
  LINK_GRID,
  MEDIA_BLOCK,
  MEDIA_CONTENT,
  REUSABLE_CONTENT_BLOCK,
  SLIDER,
} from './blocks'
import { LINK_FIELDS } from './link'
import { MEDIA_FIELDS } from './media'

export const CASE_STUDIES = `
  query CaseStudies {
    CaseStudies(limit: 300) {
      docs {
        id
        title
        createdAt
        slug
      }
    }
  }
`

export const CASE_STUDY = `
  query CaseStudy($slug: String ) {
    CaseStudies(where: { slug: { equals: $slug} }, draft: true) {
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
          ${CONTENT}
          ${CONTENT_GRID}
          ${FEATURE_HIGHLIGHT}
          ${FORM_BLOCK}
          ${LINK_GRID}
          ${MEDIA_BLOCK}
          ${MEDIA_CONTENT}
          ${REUSABLE_CONTENT_BLOCK}
          ${SLIDER}
        }
      }
    }
  }
`
