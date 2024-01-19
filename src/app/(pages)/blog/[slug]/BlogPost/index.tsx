'use client'

import React from 'react'
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

export const BlogPost: React.FC<Post> = props => {
  const { title, publishedOn, image, excerpt, content, relatedPosts } = props

  return (
    <div id="blog">
      <Gutter className={classes.pageType}>
        <Breadcrumbs
          items={[
            {
              label: 'Blog Post',
            },
          ]}
          ellipsis={false}
        />
      </Gutter>
      <Gutter className={classes.blogHeader}>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={['cols-14 start-1 cols-l-10 cols-m-5 cols-s-8'].filter(Boolean).join(' ')}
          >
            <h1 className={classes.title}>{title}</h1>
          </div>
          <div
            className={[
              classes.authorTimeSlots,
              'cols-4 start-13 cols-l-4 start-l-13 cols-m-2 star-m-5 cols-s-8 start-s-1',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <AuthorsList authors={props.authors} />
            {publishedOn && (
              <div className={classes.dateSlot}>
                <time dateTime={publishedOn}>{formatDate({ date: publishedOn })}</time>
                <CalendarIcon />
              </div>
            )}
          </div>
        </div>
      </Gutter>
      <div className={classes.mediaGutter}>
        {typeof image !== 'string' && <Media resource={image} priority />}
      </div>
      <Gutter>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-11 start-3 cols-m-8 start-m-1'].filter(Boolean).join(' ')}>
            <RichText content={excerpt} className={classes.excerpt} />
          </div>
        </div>
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
    </div>
  )
}
