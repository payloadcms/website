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

const FILTER_OPTION = `{
  name
  id
  value
}`

export const PARTNERS = `
  query Partners {
    Partners(limit: 300, where: { AND: [{ agency_status: { equals: active } }, { _status: { equals: published } } ] }, sort: "slug") {
      docs {
        id
        name
        slug
        featured
        city
        content {
          bannerImage ${MEDIA_FIELDS}
        }
        logo ${MEDIA_FIELDS}
        regions ${FILTER_OPTION}
        budgets ${FILTER_OPTION}
        industries ${FILTER_OPTION}
        specialties ${FILTER_OPTION}
      }
    }
  }
`

export const PARTNER = `
  query Partner($slug: String, $draft: Boolean) {
    Partners(where: { slug: { equals: $slug } }, limit: 1, draft: $draft) {
      docs {
        id
        name
        website
        email
        slug
        agency_status
        logo ${MEDIA_FIELDS}
        featured
        topContributor
        content {
          bannerImage ${MEDIA_FIELDS}
          overview
          services
          idealProject
          contributions {
            type
            repo
            number
          }
          caseStudy {
            featuredImage ${MEDIA_FIELDS}
            slug
            meta {
              title
              description
            }
          }
          projects {
            year
            name
            link
          }
        }
        social {
          id
          platform
          url
        }
        city
        regions ${FILTER_OPTION}
        budgets ${FILTER_OPTION}
        industries ${FILTER_OPTION}
        specialties ${FILTER_OPTION}
      }
    }
  }
`

export const PARTNER_PROGRAM = `
  query {
    PartnerProgram {
      contactForm ${FORM_FIELDS}
      hero {
        breadcrumbBarLinks {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
        richText
        heroLinks {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
      }
      featuredPartners {
        description
        partners {
          id
          name
          slug
          agency_status
          logo ${MEDIA_FIELDS}
          content {
            bannerImage ${MEDIA_FIELDS}
          }
          city
        }
      }
      contentBlocks {
        beforeDirectory {
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
        afterDirectory {
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
      }
    }
  }
`
export const FILTERS = `
  query {
    Industries(limit: 100) {
      docs {
        id
        name
        value
      }
    }
    Specialties(limit: 100) {
      docs {
        id
        name
        value
      }
    }
    Regions(limit: 100) {
      docs {
        id
        name
        value
      }
    }
    Budgets(limit: 100) {
      docs {
        id
        name
        value
      }
    }
  }
`
