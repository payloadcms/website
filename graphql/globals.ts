import { gql } from '@apollo/client';

export const MAIN_MENU_FIELDS = gql`
  fragment MainMenuFields on Menu {
    navItems {
      link {
        type
        newTab
        label
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
			}
		}
  }
`;
