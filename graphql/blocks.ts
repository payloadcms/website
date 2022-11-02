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

export const FEATURE_HIGHLIGHT = `
...on FeatureHighlight {
  blockType
  featureHighlightFields {
    features {
      type
      content
      link ${LINK_FIELDS({ disableAppearance: true })}
      code
      media ${MEDIA_FIELDS}
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
    form {
      id
      title
      redirect {
        url
      }
      confirmationType
      confirmationMessage
      submitButtonLabel
      fields {
        ...on Text {
          name
          label
          width
          defaultValue
          required
          blockType
        }
        ...on Email {
          name
          label
          width
          required
          blockType
        }
      }
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
        ${CONTENT}
        ${CONTENT_GRID}
        ${FEATURE_HIGHLIGHT}
        ${FORM_BLOCK}
        ${LINK_GRID}
        ${MEDIA_BLOCK}
        ${MEDIA_CONTENT}
      }
    }
  }
}`
