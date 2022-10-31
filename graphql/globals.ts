import { LINK_FIELDS } from './link'

export const GLOBALS = `
  query {
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
