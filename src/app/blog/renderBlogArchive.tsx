'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { BlockSpacing } from '@components/BlockSpacing'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { Gutter } from '@components/Gutter'
import { DefaultHero } from '@components/Hero/Default'
import { Post } from '@root/payload-types'

export const RenderBlogArchive: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <React.Fragment>
      <DefaultHero
        richText={[
          {
            type: 'h2',
            children: [
              {
                text: 'Keep tabs on Payload.',
              },
            ],
          },
          {
            text: 'Here, you’ll find news about feature releases, happenings in the industry, and Payload announcements in general.',
          },
        ]}
      />
      <Gutter>
        <BlockSpacing>
          <Grid>
            {(posts || []).map(blogPost => {
              return (
                <Cell key={blogPost.id} cols={4} colsS={8}>
                  <ContentMediaCard
                    title={blogPost.title}
                    description={blogPost?.meta?.description}
                    href={`/blog/${blogPost.slug}`}
                    media={blogPost.image}
                  />
                </Cell>
              )
            })}
          </Grid>
        </BlockSpacing>
      </Gutter>
    </React.Fragment>
  )
}

export default RenderBlogArchive
