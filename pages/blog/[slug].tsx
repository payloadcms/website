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
import { Media } from '../../components/Media'
import { Label } from '../../components/Label'
import { formatDateTime } from '../../utilities/format-date-time'
import { CalendarIcon } from '../../components/graphics/CalendarIcon'

import classes from './[slug].module.scss'

const BlogPostTemplate: React.FC<{
  post: Post
  preview?: boolean
}> = props => {
  const {
    post: { title, author, excerpt, image, layout, createdAt },
  } = props

  return (
    <div className={classes.blogPost}>
      <Gutter className={classes.pageType}>
        <Label>Blog Post</Label>
      </Gutter>

      <Gutter className={classes.blogHeader}>
        <Grid>
          <Cell start={1} cols={9} colsL={8} colsM={5} colsS={12}>
            <h1 className={classes.title}>{title}</h1>
          </Cell>

          <Cell
            className={classes.authorTimeSlots}
            start={10}
            cols={3}
            startL={9}
            colsL={4}
            startM={6}
            colsM={3}
            startS={1}
            colsS={8}
          >
            {author && typeof author !== 'string' && (
              <div className={classes.authorSlot}>
                <Label>{`${author?.firstName || 'Unknown'} ${author?.lastName || 'Author'}`}</Label>

                {typeof author?.photo !== 'string' && (
                  <Media className={classes.authorImage} resource={author?.photo} />
                )}
              </div>
            )}

            {createdAt && (
              <div className={classes.dateSlot}>
                <time dateTime={createdAt}>{formatDateTime(createdAt)}</time>
                <CalendarIcon />
              </div>
            )}
          </Cell>
        </Grid>
      </Gutter>

      <Gutter left="half" right="half" className={classes.mediaGutter}>
        {typeof image !== 'string' && <Media resource={image} />}
      </Gutter>

      <Gutter>
        <Grid>
          <Cell start={2} cols={10} startM={1} colsM={8} startL={2} colsL={10}>
            <RichText content={excerpt} />
          </Cell>
        </Grid>
      </Gutter>

      <RenderBlocks blocks={layout} />
    </div>
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
