import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import { Hero } from '../components/Hero'
import { getApolloClient } from '../graphql'
import { PAGE, PAGES } from '../graphql/pages'
import type { Page } from '../payload-types'
import { RenderBlocks } from '../components/RenderBlocks';

const PageTemplate: React.FC<{
  page: Page
  preview?: boolean
}> = props => {
  const {
    page: { hero, layout },
  } = props

  return (
    <React.Fragment>
      <Hero {...hero} />
      <RenderBlocks blocks={layout} />
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p></p>
    </React.Fragment>
  )
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
