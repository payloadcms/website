import { FORM_FIELDS } from './form'
import { LINK_FIELDS } from './link'
import { MEDIA_FIELDS } from './media'

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

export const CODE_BLOCK = `
...on Code {
  blockType
  codeFields {
    language
    code
  }
}
`

export const CODE_FEATURE = `
...on CodeFeature {
  blockType
  codeFeatureFields {
    richText
    enableLink
    link ${LINK_FIELDS()}
    language
    label
    code
  }
}
`

export const CALL_TO_ACTION = `
...on CalltoAction {
  blockType
  ctaFields {
    richText
    feature
    links {
      link ${LINK_FIELDS({ disableAppearance: true })}
    }
  }
}
`
export const CARD_GRID = `
...on CardGrid {
  blockType
  cardGridFields {
    richText
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

export const CONTENT = `
...on Content {
  blockType
  contentFields {
    layout
    columnOne
    columnTwo
    columnThree
  }
}
`

export const CONTENT_GRID = `
...on ContentGrid {
  blockType
  contentGridFields {
    cells {
      forceDarkBackground
      content
    }
  }
}
`

export const FORM_BLOCK = `
...on FormBlock {
  blockType
  formFields {
    container
    richText
    form ${FORM_FIELDS}
  }
}
`

export const HOVER_HIGHLIGHTS = `
...on HoverHighlightsBlock {
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

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  mediaBlockFields {
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
    alignment
    container
    richText
    link ${LINK_FIELDS({ disableAppearance: true })}
    media ${MEDIA_FIELDS}
  }
}
`

export const SLIDER = `
...on Slider {
  blockType
  sliderFields {
    sliderType
    imageSlides {
      image ${MEDIA_FIELDS}
    }
    quoteSlides {
      richText
      quoteDate
    }
  }
}`

export const STICKY_HIGHLIGHTS = `
...on StickyHighlightsBlock {
  blockType
  stickyHighlightsFields {
    highlights {
      richText
      enableLink
      link ${LINK_FIELDS({ disableAppearance: true })}
      type
      code
      media ${MEDIA_FIELDS}
    }
  }
}
`

export const STEPS = `
...on StepsBlock {
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
    reusableContent {
      layout {
        ${BANNER}
        ${BLOG_CONTENT}
        ${CALL_TO_ACTION}
        ${CARD_GRID}
        ${CASE_STUDIES_HIGHLIGHT}
        ${CODE_BLOCK}
        ${CODE_FEATURE}
        ${CONTENT}
        ${CONTENT_GRID}
        ${FORM_BLOCK}
        ${HOVER_HIGHLIGHTS}
        ${LINK_GRID}
        ${MEDIA_BLOCK}
        ${MEDIA_CONTENT}
        ${SLIDER}
        ${STEPS}
        ${STICKY_HIGHLIGHTS}
      }
    }
  }
}`
