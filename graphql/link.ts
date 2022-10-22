type Args = {
  disableLabel?: true
  disableAppearance?: true
}

export const LINK_FIELDS = ({ disableAppearance, disableLabel }: Args = {}) => `{
  ${!disableLabel ? 'label' : ''}
  ${!disableAppearance ? 'appearance' : ''}
  type
  newTab
  url
  reference {
    relationTo
    value {
      ...on Page {
        slug
      }
      ...on Post {
        slug
      }
      ...on CaseStudy {
        slug
      }
      ...on UseCase {
        slug
      }
    }
  }
}`