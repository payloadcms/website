import { LINK_FIELDS } from './link'

export const GLOBALS = `
  query {
    Announcement {
      message
    }

    MainMenu {
      navItems {
        link ${LINK_FIELDS({ disableAppearance: true })}
      }
    }

    Footer {
      columns {
        navItems {
          link ${LINK_FIELDS({ disableAppearance: true })}
        }
      }  
    }
  }
`
