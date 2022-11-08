'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@components/providers/Theme'
import { DefaultHero } from '@components/Hero/Default'
import { BlockSpacing } from '@components/BlockSpacing'
import { Card } from '@components/Card'
import { Post } from '@root/payload-types'
import { Gutter } from '../../components/Gutter'

import classes from './index.module.scss'

export const RenderBlogArchive: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} className={classes.pullHeader} pullUp>
      <DefaultHero
        pageLabel="Blog Posts"
        richText={[
          {
            type: 'h2',
            children: [
              {
                text: 'Read the latest Payload news.',
              },
            ],
          },
        ]}
        sidebarContent={[
          {
            children: [
              {
                text: 'Here, you’ll find news about feature releases, happenings in the industry, and Payload announcements in general.',
              },
            ],
          },
        ]}
      />
      <Gutter>
        <BlockSpacing>
          <Grid>
            {(posts || []).map(blogPost => {
              return (
                <Cell key={blogPost.id} cols={4} colsS={8} className={classes.blogPost}>
                  <Card
                    cardType="blog"
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
    </HeaderObserver>
  )
}

export default RenderBlogArchive
