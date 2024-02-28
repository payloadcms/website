import {
  CALL_TO_ACTION,
  CALLOUT,
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
  MEDIA_CONTENT_ACCORDION,
  REUSABLE_CONTENT_BLOCK,
  SLIDER,
  STATEMENT,
  STEPS,
  STICKY_HIGHLIGHTS,
} from './blocks'
import { MEDIA_FIELDS } from './media'
import { META_FIELDS } from './meta'

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
        industry
        useCase
        featuredImage ${MEDIA_FIELDS}
        slug
        url
        layout {
          ${CALL_TO_ACTION}
          ${CALLOUT}
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
          ${MEDIA_CONTENT_ACCORDION}
          ${REUSABLE_CONTENT_BLOCK}
          ${SLIDER}
          ${STATEMENT}
          ${STEPS}
          ${STICKY_HIGHLIGHTS}
        }
        meta ${META_FIELDS}
      }
    }
  }
`
