'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '../../components/Gutter'

import classes from './index.module.scss'

export const RenderBlogArchive = ({ posts }) => {
  return (
    <div className={classes.archive}>
      <Gutter>
        <h2>Blog posts</h2>
        <Grid>
          {(posts || []).map(blogPost => (
            <Cell key={blogPost.id} cols={6} className={classes.blogPost}>
              <h5>{blogPost.title}</h5>
            </Cell>
          ))}
        </Grid>
      </Gutter>
    </div>
  )
}

export default RenderBlogArchive
