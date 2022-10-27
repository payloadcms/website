import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { getApolloClient } from '../../graphql'
import type { Post } from '../../payload-types'
import { RenderBlocks } from '../../components/RenderBlocks'
import { POST, POSTS } from '../../graphql/posts'
import RichText from '../../components/RichText'
import { Gutter } from '../../components/Gutter'

const BlogPostTemplate: React.FC<{
  post: Post
  preview?: boolean
}> = props => {
  const {
    post: { excerpt, layout },
  } = props

  return (
    <React.Fragment>
      <Gutter>
        <Grid>
          <Cell start={2} cols={10} startL={1} colsL={8}>
            <RichText content={excerpt} />
          </Cell>
        </Grid>
      </Gutter>

      <RenderBlocks blocks={layout} />
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

  const slug = params?.slug

  if (!slug) {
    return {
      notFound: true,
    }
  }

  try {
    const { data } = await apolloClient.query({
      query: POST,
      variables: {
        slug,
      },
      context: {
        headers: {
          ...(preview
            ? {
                // when previewing, send the payload token to bypass draft access control
                Authorization: `JWT ${payloadToken}`,
              }
            : {}),
        },
      },
    })

    if (!data.Posts.docs[0]) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        post: data.Posts.docs[0],
        mainMenu: data.MainMenu,
        footer: data.Footer,
        preview: preview || null,
        collection: 'posts',
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
    query: POSTS,
  })

  return {
    paths: data.Posts.docs.map(({ slug }) => ({
      params: { slug },
    })),
    fallback: 'blocking',
  }
}

export default BlogPostTemplate
