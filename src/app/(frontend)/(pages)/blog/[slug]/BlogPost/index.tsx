import type { Post } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { Breadcrumbs } from '@components/Breadcrumbs/index.js'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Media } from '@components/Media/index.js'
import { RenderBlocks } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import { Video } from '@components/RichText/Video/index.js'
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
    category,
    title,
    useVideo,
    videoUrl,
    authorType,
    guestAuthor,
    guestSocials,
    relatedDocs,
  } = props

  return (
    <div className={classes.blog} id="blog">
      <BackgroundGrid wideGrid />
      <Gutter>
        <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
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
                          {category === 'blog' ? 'All Posts' : 'Guides'}
                        </span>
                      ),
                      url: category === 'blog' ? '/blog' : '/guides',
                    },
                    {
                      label: <time>{formatDate({ date: publishedOn })}</time>,
                    },
                  ]}
                  className={classes.breadcrumbs}
                />
                <h1 className={classes.title}>{title}</h1>
                {category === 'guide' &&
                  (authorType === 'guest' ? (
                    <span className={classes.guideBadge}>Community Guide</span>
                  ) : (
                    <span className={classes.guideBadge}>Official Guide</span>
                  ))}
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
              <div className={classes.heroImageWrap}>
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
