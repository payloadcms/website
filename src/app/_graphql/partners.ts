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
import { LINK_FIELDS } from './link'
import { MEDIA_FIELDS } from './media'

export const PARTNERS = `
  query Partners {
    Partners(limit: 300, where: { agency_status: { equals: active } }) {
      docs {
        id
        name
        website
        email
        slug
        agency_status
        hubspotID
        featured
        badges
        logo ${MEDIA_FIELDS}
        content {
          bannerImage ${MEDIA_FIELDS}
          overview
          services
          idealProject
          contributions {
            type
            number
          }
          projects {
            year
            name
            link
          }
        }
        city
        regions
        budgets
        industries
        technologies
        social {
          platform
          url
        }
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
        hubspotID
        featured
        badges
        logo ${MEDIA_FIELDS}
        content {
          bannerImage ${MEDIA_FIELDS}
          overview
          services
          idealProject
          contributions {
            type
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
        city
        regions
        budgets
        industries
        technologies
        social {
          platform
          url
        }
      }
    }
  }
`

export const PARTNER_PROGRAM = `
  query {
    PartnerProgram {
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
          website
          email
          slug
          agency_status
          hubspotID
          featured
          badges
          logo ${MEDIA_FIELDS}
          content {
            bannerImage ${MEDIA_FIELDS}
            overview
            services
            idealProject
            contributions {
              type
              number
            }
            projects {
              year
              name
              link
            }
          }
          city
          regions
          budgets
          industries
          technologies
          social {
            platform
            url
          }
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
