import { FORM_FIELDS } from './form'
import { LINK_FIELDS } from './link'
import { MEDIA_FIELDS } from './media'

const SETTINGS = `{
  theme
}
`

const CODE_BLIPS = `{
  row
  feature
  label
  enableLink
  link ${LINK_FIELDS({ disableAppearance: true })}
}`

export const BANNER = `
...on Banner {
  blockType
  bannerFields {
    type
    addCheckmark
    content
  }
}
`
export const BLOG_CONTENT = `
...on BlogContent {
  blockType
  blogContentFields {
    richText
  }
}
`

export const BLOG_MARKDOWN = `
...on BlogMarkdown {
  blockType
  blogMarkdownFields {
    markdown
  }
}
`

export const CODE_BLOCK = `
...on Code {
  blockType
  codeFields {
    language
    code
    codeBlips {
      row
      feature
      label
    }
  }
}
`

export const CODE_FEATURE = `
...on CodeFeature {
  blockType
  codeFeatureFields {
    settings ${SETTINGS}
    forceDarkBackground
    alignment
    heading
    richText
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
    }
    codeTabs {
      language
      label
      code
      codeBlips ${CODE_BLIPS}
    }
  }
}
`

export const CALLOUT = `
...on Callout {
  blockType
  calloutFields {
    settings ${SETTINGS}
    richText
    role
    author
    logo ${MEDIA_FIELDS}
    images {
      image ${MEDIA_FIELDS}
    }
  }
}
`

export const CALL_TO_ACTION = `
...on Cta {
  blockType
  ctaFields {
    settings ${SETTINGS}
    richText
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
      type
      npmCta {
        label
      }
    }
  }
}
`

export const CARD_GRID = `
...on CardGrid {
  blockType
  cardGridFields {
    settings ${SETTINGS}
    richText
    revealDescription
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
    }
    cards {
      title
      description
      enableLink
      link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
    }
  }
}
`

export const CASE_STUDIES_HIGHLIGHT = `
...on CaseStudiesHighlight {
  blockType
  caseStudiesHighlightFields {
    settings ${SETTINGS}
    richText
    caseStudies {
      slug
      featuredImage {
        alt
        url
      }
    }
  }
}
`

export const CASE_STUDY_CARDS = `
...on CaseStudyCards {
  blockType
  caseStudyCardFields {
    settings ${SETTINGS}
    pixels
    cards {
      richText
      caseStudy {
        slug
        featuredImage ${MEDIA_FIELDS}
      }
    }
  }
}
`

export const CASE_STUDY_PARALLAX = `
...on CaseStudyParallax {
  blockType
  caseStudyParallaxFields {
    settings ${SETTINGS}
    items {
      quote
      author
      tabLabel
      logo ${MEDIA_FIELDS}
      images {
        image ${MEDIA_FIELDS}
      }
      caseStudy {
        slug
      }
    }
  }
}
`

export const CONTENT = `
...on Content {
  blockType
  contentFields {
    useLeadingHeader
    leadingHeader
    layout
    columnOne
    columnTwo
    columnThree
    settings ${SETTINGS}
  }
}
`

export const CONTENT_GRID = `
...on ContentGrid {
  blockType
  contentGridFields {
    settings ${SETTINGS}
    style
    content
    showNumbers
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
    }
    cells {
      content
    }
  }
}
`

export const CODE_EXAMPLE = `
... on CodeExampleBlock {
  code
  id
  blockType
}
`

export const MEDIA_EXAMPLE = `
... on MediaExampleBlock {
  media ${MEDIA_FIELDS}
  id
  blockType
}
`

export const EXAMPLE_TABS = `
...on ExampleTabsBlock {
  blockType
  content
  tabs {
    label
    content
    examples {
      ${CODE_EXAMPLE}
      ${MEDIA_EXAMPLE}
    }
  }
}
`

export const FORM_BLOCK = `
...on FormBlock {
  blockType
  formFields {
    richText
    form ${FORM_FIELDS}
  }
}
`

export const HOVER_CARDS = `
...on HoverCards {
  blockType
  hoverCardsFields {
    settings ${SETTINGS}
    richText
    cards {
      title
      description
      link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
    }
  }
}
`

export const HOVER_HIGHLIGHTS = `
...on HoverHighlights {
  blockType
  hoverHighlightsFields {
    richText
    addRowNumbers
    highlights {
      title
      description
      media ${MEDIA_FIELDS}
      enableLink
      link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
    }
  }
}
`

export const LINK_GRID = `
...on LinkGrid {
  blockType
  linkGridFields {
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
    }
  }
}
`

export const LOGO_GRID = `
...on LogoGrid {
  blockType
  logoGridFields {
    richText
    enableLink
    link ${LINK_FIELDS({ disableAppearance: true })}
    logos {
      logoMedia ${MEDIA_FIELDS}
    }
  }
}
`

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  mediaBlockFields {
    settings ${SETTINGS}
    position
    media ${MEDIA_FIELDS}
    caption
  }
}
`

export const MEDIA_CONTENT = `
...on MediaContent {
  blockType
  mediaContentFields {
    settings ${SETTINGS}
    alignment
    richText
    enableLink
    link ${LINK_FIELDS({ disableAppearance: true })}
    images {
      image ${MEDIA_FIELDS}
    }
  }
}
`

export const MEDIA_CONTENT_ACCORDION = `
...on MediaContentAccordion {
  blockType
  mediaContentAccordionFields {
    settings ${SETTINGS}
    alignment
    leader
    heading
    accordion {
      position
      background
      mediaLabel
      mediaDescription
      enableLink
      link ${LINK_FIELDS({ disableAppearance: true })}
      media ${MEDIA_FIELDS}
    }
  }
}
`

export const PRICING_BLOCK = `
...on Pricing {
  blockType
  pricingFields {
    settings ${SETTINGS}
    plans {
      name
      hasPrice
      enableCreatePayload
      price
      title
      description
      enableLink
      link ${LINK_FIELDS({ disableAppearance: true })}
      features {
        icon
        feature
      }
    }
    disclaimer
  }
}
`

export const SLIDER = `
...on Slider {
  blockType
  sliderFields {
    settings ${SETTINGS}
    quoteSlides {
      leader
      quote
      author
      role
    }
  }
}`

export const STATEMENT = `
...on Statement {
  blockType
  statementFields {
    settings ${SETTINGS}
    richText
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
    }
  }
}
`

export const STICKY_HIGHLIGHTS = `
...on StickyHighlights {
  blockType
  stickyHighlightsFields {
    settings ${SETTINGS}
    highlights {
      richText
      enableLink
      link ${LINK_FIELDS({ disableAppearance: true })}
      type
      code
      codeBlips ${CODE_BLIPS}
      media ${MEDIA_FIELDS}
    }
  }
}
`

export const STEPS = `
...on Steps {
  blockType
  stepsFields {
    steps {
      layout {
        ${CODE_FEATURE}
        ${CONTENT}
        ${HOVER_HIGHLIGHTS}
        ${STICKY_HIGHLIGHTS}
      }
    }
  }
}
`

export const REUSABLE_CONTENT_BLOCK = `
...on ReusableContentBlock {
  blockType
  reusableContentBlockFields {
    customId
    reusableContent {
      layout {
        ${BANNER}
        ${BLOG_CONTENT}
        ${BLOG_MARKDOWN}
        ${CALLOUT}
        ${CALL_TO_ACTION}
        ${CARD_GRID}
        ${CASE_STUDIES_HIGHLIGHT}
        ${CASE_STUDY_CARDS}
        ${CODE_BLOCK}
        ${CODE_FEATURE}
        ${CONTENT}
        ${CONTENT_GRID}
        ${EXAMPLE_TABS}
        ${FORM_BLOCK}
        ${HOVER_HIGHLIGHTS}
        ${LINK_GRID}
        ${LOGO_GRID}
        ${MEDIA_BLOCK}
        ${MEDIA_CONTENT}
        ${MEDIA_CONTENT_ACCORDION}
        ${SLIDER}
        ${STATEMENT}
        ${STEPS}
        ${STICKY_HIGHLIGHTS}
      }
    }
  }
}`
