import { LINK_FIELDS } from './link'

export const GLOBALS = `
  query {
    MainMenu {
      tabs {
        label
        enableDirectLink
        link ${LINK_FIELDS({ disableAppearance: true, disableLabel: true })}
        description
        descriptionLinks {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
        navItems {
          style
          listLinks {
            tag
            links {
              link ${LINK_FIELDS({ disableAppearance: true })}
            }
          }
          defaultLink {
            description
            link ${LINK_FIELDS({ disableAppearance: true })}
          }
          featuredLink {
            tag
            label
            links {
              link ${LINK_FIELDS({ disableAppearance: true })}
            }
          }
        }
      }
    }

    Footer {
      columns {
        navItems {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
      }  
    }

    TopBar {
      starText {
        desktop
        mobile
      }
      announcement {   
        name
        content
      }
    }
  }
`
