import { gql } from "@apollo/client";
import { MAIN_MENU_FIELDS } from "./globals";

export const PAGES = gql`
  query Pages {
    Pages(limit: 300) {
      docs {
        slug
      }
    }
  }
`

export const PAGE = gql`
  query Page($slug: string ) {
    Pages(where: { slug: { equals: $slug}}) {
      title
    }

    MainMenu {
      ...MainMenuFields
    }
  }

  ${MAIN_MENU_FIELDS}
`