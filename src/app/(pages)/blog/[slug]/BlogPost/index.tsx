'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { CalendarIcon } from '@graphics/CalendarIcon'
import { formatDate } from '@utilities/format-date-time'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Post } from '@root/payload-types'
import { Gutter } from '../../../../../components/Gutter'
import { Media } from '../../../../../components/Media'
import { RenderBlocks } from '../../../../../components/RenderBlocks'
import { RichText } from '../../../../../components/RichText'
import { AuthorsList } from '../AuthorsList'

import classes from './index.module.scss'

export const BlogPost: React.FC<
  Post & {
    relatedPosts?: Post[]
  }
> = props => {
  const { title, publishedOn, image, excerpt, content, relatedPosts } = props

  return (
    <React.Fragment>
      <Gutter className={classes.pageType}>
        <Breadcrumbs
          items={[
            {
              label: 'Blog Post',
            },
          ]}
        />
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
            <AuthorsList authors={props.authors} />
            {publishedOn && (
              <div className={classes.dateSlot}>
                <time dateTime={publishedOn}>{formatDate({ date: publishedOn })}</time>
                <CalendarIcon />
              </div>
            )}
          </Cell>
        </Grid>
      </Gutter>
      <div className={classes.mediaGutter}>
        {typeof image !== 'string' && <Media resource={image} priority />}
      </div>
      <Gutter>
        <Grid>
          <Cell start={2} cols={10} startM={1} colsM={8} startL={2} colsL={10}>
            <RichText content={excerpt} className={classes.excerpt} />
          </Cell>
        </Grid>
      </Gutter>
      <RenderBlocks
        blocks={[
          ...(content || []),
          {
            blockType: 'relatedPosts',
            blockName: 'Related Posts',
            relatedPosts: relatedPosts || [],
          },
        ]}
      />
    </React.Fragment>
  )
}
