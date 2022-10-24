import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import { getApolloClient } from '../graphql'
import { PAGE, PAGES } from '../graphql/pages'
import type { Footer, MainMenu, Page } from '../payload-types'

const PageTemplate: React.FC<{
  page: Page
  mainMenu: MainMenu
  footer: Footer
  preview?: boolean
}> = props => {
  const {
    page: { title },
    mainMenu,
    footer,
  } = props

  return <h1>{title}</h1>
}

export const getStaticProps: GetStaticProps = async context => {
  const { preview, previewData, params } = context

  const { payloadToken } =
    (previewData as {
      payloadToken: string
    }) || {}

  // IMPORTANT: do not use the shared Apollo client here to avoid cache during preview and ISR
  const apolloClient = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`,
    cache: new InMemoryCache(),
  })

  const slug = params?.slug || 'home'

  try {
    const { data } = await apolloClient.query({
      query: PAGE,
      variables: {
        slug,
      },
      context: {
        headers: {
          ...(preview
            ? {
                Authorization: `JWT ${payloadToken}`, // when previewing, send the payload token to bypass draft access control
              }
            : {}),
        },
      },
    })

    if (!data.Pages.docs[0]) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        page: data.Pages.docs[0],
        mainMenu: data.MainMenu,
        footer: data.Footer,
        preview: preview || null,
        collection: 'pages',
      },
    }
  } catch (err) {
    console.warn(JSON.stringify(err.networkError.result))

    return {
      notFound: true,
    }
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = getApolloClient()

  const { data } = await apolloClient.query({
    query: PAGES,
  })

  return {
    paths: data.Pages.docs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  }
}

export default PageTemplate
