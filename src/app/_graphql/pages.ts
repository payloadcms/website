import {
  CALL_TO_ACTION,
  CALLOUT,
  CARD_GRID,
  CASE_STUDIES_HIGHLIGHT,
  CASE_STUDY_CARDS,
  CASE_STUDY_PARALLAX,
  CODE_FEATURE,
  CONTENT,
  CONTENT_GRID,
  EXAMPLE_TABS,
  FORM_BLOCK,
  HOVER_CARDS,
  HOVER_HIGHLIGHTS,
  LINK_GRID,
  LOGO_GRID,
  MEDIA_BLOCK,
  MEDIA_CONTENT,
  MEDIA_CONTENT_ACCORDION,
  PRICING_BLOCK,
  REUSABLE_CONTENT_BLOCK,
  SLIDER,
  STATEMENT,
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
          enableBreadcrumbsBar
          breadcrumbsBarLinks {
            link ${LINK_FIELDS({ disableAppearance: true })}
          }
          theme
          type
          richText
          description
          primaryButtons {
            link ${LINK_FIELDS({ disableAppearance: true })}
          }
          fullBackground
          secondaryHeading
          secondaryDescription
          secondaryButtons {
            link ${LINK_FIELDS({ disableAppearance: true })}
          }
          links {
            link ${LINK_FIELDS()}
          }
          images {
            image ${MEDIA_FIELDS}
          }
          media ${MEDIA_FIELDS}
          featureVideo ${MEDIA_FIELDS}
          secondaryMedia ${MEDIA_FIELDS}
          form ${FORM_FIELDS}
          logos {
            logoMedia ${MEDIA_FIELDS}
          }
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
          ${CALLOUT}
          ${CALL_TO_ACTION}
          ${CARD_GRID}
          ${CASE_STUDIES_HIGHLIGHT}
          ${CASE_STUDY_CARDS}
          ${CASE_STUDY_PARALLAX}
          ${CODE_FEATURE}
          ${CONTENT}
          ${CONTENT_GRID}
          ${EXAMPLE_TABS}
          ${FORM_BLOCK}
          ${HOVER_CARDS}
          ${HOVER_HIGHLIGHTS}
          ${LINK_GRID}
          ${LOGO_GRID}
          ${MEDIA_BLOCK}
          ${MEDIA_CONTENT}
          ${MEDIA_CONTENT_ACCORDION}
          ${PRICING_BLOCK}
          ${REUSABLE_CONTENT_BLOCK}
          ${SLIDER}
          ${STATEMENT}
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
