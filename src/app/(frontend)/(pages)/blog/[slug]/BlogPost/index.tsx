'use client'

import type { Post } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { Breadcrumbs } from '@components/Breadcrumbs/index.js'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import { RenderBlocks } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Video } from '@components/RichText/Video/index.js'
import { useResize } from '@root/utilities/use-resize.js'
import { formatDate } from '@utilities/format-date-time.js'
import React from 'react'

import { AuthorsList, GuestAuthorList } from '../AuthorsList/index.js'
import classes from './index.module.scss'
import Link from 'next/link.js'
import { ArrowRightIcon } from '@icons/ArrowRightIcon/index.js'
export const BlogPost: React.FC<Post> = (props) => {
  const {
    content,
    excerpt,
    image,
    publishedOn,
    relatedPosts,
    title,
    useVideo,
    videoUrl,
    authorType,
    guestAuthor,
    guestSocials,
  } = props
  const [docPadding, setDocPadding] = React.useState(0)
  const docRef = React.useRef<HTMLDivElement>(null)
  const docSize = useResize(docRef)

  React.useEffect(() => {
    if (docRef.current?.offsetWidth === undefined) {
      return
    }
    setDocPadding(Math.round(docRef.current?.offsetWidth / 16) - 2)
  }, [docRef.current?.offsetWidth, docSize])

  let videoToUse: {
    id: string
    platform: 'vimeo' | 'youtube'
  } | null = null

  if (videoUrl && (videoUrl.includes('vimeo') || videoUrl.includes('youtube'))) {
    const platform = videoUrl.includes('vimeo') ? 'vimeo' : 'youtube'
    const id = platform === 'vimeo' ? videoUrl.split('/').pop() : videoUrl.split('v=').pop()

    videoToUse = {
      id: id || '',
      platform,
    }
  }

  return (
    <div className={classes.blog} id="blog">
      <BackgroundGrid wideGrid />
      <Gutter>
        <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')} ref={docRef}>
          <div className={[classes.stickyColumn, 'cols-3 start-1'].filter(Boolean).join(' ')}>
            <div className={classes.stickyContent}>
              {authorType === 'team' ? (
                <AuthorsList authors={props.authors} />
              ) : (
                <GuestAuthorList author={guestAuthor} socials={guestSocials} />
              )}
              <div className={classes.discordGitWrap}>
                <DiscordGitCTA appearance="minimal" />
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
                  items={[
                    {
                      label: (
                        <span className={classes.allPosts}>
                          <ArrowRightIcon />
                          All Posts
                        </span>
                      ),
                      url: '/blog',
                    },
                    {
                      label: <time>{formatDate({ date: publishedOn })}</time>,
                    },
                  ]}
                  className={classes.breadcrumbs}
                />
                <h1 className={classes.title}>{title}</h1>
                {authorType === 'guest' && (
                  <span className={classes.communityGuide}>Community Guide</span>
                )}
              </div>
              <div className={classes.mobileAuthor}>
                {authorType === 'team' ? (
                  <AuthorsList authors={props.authors} />
                ) : (
                  <GuestAuthorList author={guestAuthor} socials={guestSocials} />
                )}
              </div>
            </div>
            {typeof image !== 'string' && (
              <div
                className={classes.heroImageWrap}
                style={{ marginLeft: -(docPadding + 1), marginRight: docPadding * -4 - 6 }}
              >
                {useVideo ? (
                  <Video {...videoToUse} />
                ) : (
                  <Media className={classes.heroImage} priority resource={image} />
                )}
              </div>
            )}
            {typeof image !== 'string' && (
              <div className={classes.mobileImage}>
                <Media className={classes.heroImage} priority resource={image} />
              </div>
            )}
            <RichText className={classes.excerpt} content={excerpt} />
            <div className={classes.blocks}>
              <RenderBlocks
                blocks={[
                  ...(content || []),
                  {
                    blockName: 'Related Posts',
                    blockType: 'relatedPosts',
                    relatedPosts: relatedPosts || [],
                  },
                ]}
                disableGrid
                disableGutter
              />
            </div>
          </div>
        </div>
      </Gutter>
    </div>
  )
}
