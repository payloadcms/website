'use client'

import React from 'react'
import { formatDate } from '@utilities/format-date-time'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Breadcrumbs } from '@components/Breadcrumbs'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { Post } from '@root/payload-types'
import { useResize } from '@root/utilities/use-resize'
import { Gutter } from '../../../../../components/Gutter'
import { Media } from '../../../../../components/Media'
import { RenderBlocks } from '../../../../../components/RenderBlocks'
import { RichText } from '../../../../../components/RichText'
import { AuthorsList } from '../AuthorsList'

import classes from './index.module.scss'
export const BlogPost: React.FC<Post> = props => {
  const { title, publishedOn, image, excerpt, content, relatedPosts } = props
  const [docPadding, setDocPadding] = React.useState(0)
  const docRef = React.useRef<HTMLDivElement>(null)
  const docSize = useResize(docRef)

  React.useEffect(() => {
    if (docRef.current?.offsetWidth === undefined) return
    setDocPadding(Math.round(docRef.current?.offsetWidth / 16) - 2)
  }, [docRef.current?.offsetWidth, docSize])

  return (
    <div id="blog" className={classes.blog}>
      <BackgroundGrid wideGrid />
      <Gutter>
        <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')} ref={docRef}>
          <div className={[classes.stickyColumn, 'cols-3 start-1'].filter(Boolean).join(' ')}>
            <div className={classes.stickyContent}>
              <div className={classes.authorTimeSlots}>
                <AuthorsList authors={props.authors} />
                {publishedOn && (
                  <div className={classes.dateSlot}>
                    <span className={classes.publishLabel}>Published On</span>
                    <time className={classes.date} dateTime={publishedOn}>
                      {formatDate({ date: publishedOn })}
                    </time>
                  </div>
                )}
              </div>
              <div className={classes.discordGitWrap}>
                <DiscordGitCTA style="minimal" />
              </div>
            </div>
          </div>

          <div
            className={[classes.blogWrap, 'blog-wrap', 'cols-8 start-5 cols-m-8 start-m-1']
              .filter(Boolean)
              .join(' ')}
          >
            <div className={classes.titleWrap}>
              <div>
                <Breadcrumbs
                  className={classes.breadcrumbs}
                  items={[
                    {
                      label: 'Blog Post',
                    },
                  ]}
                  ellipsis={false}
                />
                <h1 className={classes.title}>{title}</h1>
              </div>
              <div className={classes.mobileAuthor}>
                <AuthorsList authors={props.authors} />
                {publishedOn && (
                  <div className={classes.dateSlot}>
                    <span className={classes.publishLabel}>Published On</span>
                    <time className={classes.date} dateTime={publishedOn}>
                      {formatDate({ date: publishedOn })}
                    </time>
                  </div>
                )}
              </div>
            </div>
            {typeof image !== 'string' && (
              <div
                className={classes.heroImageWrap}
                style={{ marginLeft: -(docPadding + 1), marginRight: docPadding * -4 - 6 }}
              >
                <Media className={classes.heroImage} resource={image} priority />
              </div>
            )}
            {typeof image !== 'string' && (
              <div className={classes.mobileImage}>
                <Media className={classes.heroImage} resource={image} priority />
              </div>
            )}
            <RichText content={excerpt} className={classes.excerpt} />
            <div className={classes.blocks}>
              <RenderBlocks
                blocks={[
                  ...(content || []),
                  {
                    blockType: 'relatedPosts',
                    blockName: 'Related Posts',
                    relatedPosts: relatedPosts || [],
                  },
                ]}
                disableGutter
                disableGrid
              />
            </div>
          </div>
        </div>
      </Gutter>
    </div>
  )
}
