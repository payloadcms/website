'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@components/providers/Theme'
import { DefaultHero } from '@components/Hero/Default'
import { BlockSpacing } from '@components/BlockSpacing'
import { Gutter } from '../../components/Gutter'

import classes from './index.module.scss'

export const RenderBlogArchive = ({ posts }) => {
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
            {(posts || []).map(blogPost => (
              <Cell key={blogPost.id} cols={6} className={classes.blogPost}>
                <Link href={`/blog/${blogPost.slug}`}>
                  <h5>{blogPost.title}</h5>
                </Link>
              </Cell>
            ))}
          </Grid>
        </BlockSpacing>
      </Gutter>
    </HeaderObserver>
  )
}

export default RenderBlogArchive
