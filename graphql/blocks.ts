import { LINK_FIELDS } from "./link";

export const BANNER = `
...on Banner {
  blockType
  type
  addCheckmark
  bannerContent: content
}
`
export const BLOG_CONTENT = `
...on BlogContent {
  blockType
  blogContentRichText: richText
}
`

export const CODE_BLOCK = `
...on Code {
  blockType
  language
  code
}
`

export const CALL_TO_ACTION = `
...on CalltoAction {
  blockType
  richText
  feature
  ctaLinks: links {
    link ${LINK_FIELDS({ disableAppearance: true })}
  }
}
`
export const CARD_GRID = `
...on CardGrid {
  blockType
  richText
  cardGridLinks: links {
    link ${LINK_FIELDS({ disableAppearance: true })}
  }
  cards {
    title
    description
    link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
  }
}
`

export const CASE_STUDIES_HIGHLIGHT = `
...on CaseStudiesHighlight {
  blockType
  richText
  caseStudies {
    slug
    featuredImage {
      url
    }
  }
}
`

export const CONTENT = `
...on Content {
  blockType
  layout
  columnOne
  columnTwo
  columnThree
}
`

export const CONTENT_GRID = `
...on ContentGrid {
  blockType
  content {
    forceDarkBackground
    content
  }
}
`

export const FEATURE_HIGHLIGHT = `
...on FeatureHighlight {
  blockType
  features {
    type
    content
    link ${LINK_FIELDS({ disableAppearance: true })}
    code
    media {
      url
    }
  }
}
`

export const FORM_BLOCK = `
...on FormBlock {
  blockType
  container
  richText
  form {
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
`

export const LINK_GRID = `
...on LinkGrid {
  blockType
  linkGridLinks: links {
    link ${LINK_FIELDS({ disableAppearance: true })}
  }
}
`

export const MEDIA_BLOCK = `
...on MediaBlock {
  blockType
  position
  media {
    url
  }
  caption
}
`

export const MEDIA_CONTENT = `
...on MediaContent {
  blockType
  alignment
  container
  richText
  link ${LINK_FIELDS({ disableAppearance: true })}
  media {
    url
  }
}
`

export const REUSABLE_CONTENT_BLOCK = `
...on ReusableContentBlock {
  blockType
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
}`