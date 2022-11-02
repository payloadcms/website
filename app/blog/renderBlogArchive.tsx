'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'
import { Gutter } from '../../components/Gutter'

import classes from './index.module.scss'

export const RenderBlogArchive = ({ posts }) => {
  return (
    <Gutter>
      <h2>Blog posts</h2>
      <Grid>
        {(posts || []).map(blogPost => (
          <Cell key={blogPost.id} cols={6} className={classes.blogPost}>
            <Link href={`/blog/${blogPost.slug}`}>
              <h5>{blogPost.title}</h5>
            </Link>
          </Cell>
        ))}
      </Grid>
    </Gutter>
  )
}

export default RenderBlogArchive
