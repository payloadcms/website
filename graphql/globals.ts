import { LINK_FIELDS } from './link'

export const MAIN_MENU = `
  query MainMenu {
    MainMenu {
      navItems {
        link ${LINK_FIELDS({ disableAppearance: true })}
      }
    }
  }
`

export const FOOTER = `
  Footer {
    columns {
      navItems {
        link ${LINK_FIELDS({ disableAppearance: true })}
      }
    }  
  }
`
