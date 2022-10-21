import { gql } from '@apollo/client';
import { LINK_FIELDS } from './link';

export const MAIN_MENU_FIELDS = gql`
  fragment MainMenuFields on MainMenu {
    navItems {
      link ${LINK_FIELDS}
		}
  }
`;

export const FOOTER_FIELDS = gql`
  fragment FooterFields on Footer {
    columns {
      navItems {
        link ${LINK_FIELDS}
      }
    }  
  }
`