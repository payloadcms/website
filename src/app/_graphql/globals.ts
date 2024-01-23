import { LINK_FIELDS } from './link'

export const GLOBALS = `
  query {
    MainMenu {
      tabs {
        label
        navItems {
          link ${LINK_FIELDS({ disableAppearance: true })}
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
