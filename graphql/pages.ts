import { gql } from "@apollo/client";
import { FOOTER, MAIN_MENU } from "./globals";

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
  query Page($slug: String ) {
    Pages(where: { slug: { equals: $slug}}) {
      docs {
        title
      }
    }

    ${MAIN_MENU}
    ${FOOTER}
  }
`