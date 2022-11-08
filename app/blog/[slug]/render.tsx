'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Breadcrumbs from '@components/Breadcrumbs'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@components/providers/Theme'
import { RenderBlocks } from '../../../components/RenderBlocks'
import { RichText } from '../../../components/RichText'
import { Gutter } from '../../../components/Gutter'
import { Media } from '../../../components/Media'
import { Label } from '../../../components/Label'
import { formatDate } from '../../../utilities/format-date-time'
import { CalendarIcon } from '../../../components/graphics/CalendarIcon'
import { Post } from '../../../payload-types'

import classes from './index.module.scss'

export const RenderBlogPost: React.FC<Post> = props => {
  const { title, author, publishedOn, image, excerpt, content } = props

  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
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
            {author && typeof author !== 'string' && (
              <div className={classes.authorSlot}>
                <Label>{`${author?.firstName || 'Unknown'} ${author?.lastName || 'Author'}`}</Label>

                {typeof author?.photo !== 'string' && (
                  <Media className={classes.authorImage} resource={author?.photo} />
                )}
              </div>
            )}

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
        {typeof image !== 'string' && <Media resource={image} />}
      </div>

      <Gutter>
        <Grid>
          <Cell start={2} cols={10} startM={1} colsM={8} startL={2} colsL={10}>
            <RichText content={excerpt} className={classes.excerpt} />
          </Cell>
        </Grid>
      </Gutter>

      <RenderBlocks blocks={content} />
    </HeaderObserver>
  )
}

export default RenderBlogPost
