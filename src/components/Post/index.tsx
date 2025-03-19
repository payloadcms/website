import type { Post as PostType } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { Breadcrumbs } from '@components/Breadcrumbs/index'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { RichText } from '@components/RichText/index'
import { Video } from '@components/RichText/Video/index'
import { getVideo } from '@root/utilities/get-video'
import { formatDate } from '@utilities/format-date-time'
import React from 'react'

import { AuthorsList, GuestAuthorList } from './AuthorsList/index'
import classes from './index.module.scss'
import { ArrowRightIcon } from '@icons/ArrowRightIcon/index'
export const Post: React.FC<PostType> = (props) => {
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
  } = props

  return (
    <div className={classes.post} id="blog">
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
                          {typeof category !== 'string' && category?.name}
                        </span>
                      ),
                      url: typeof category !== 'string' ? `/${category?.slug}` : '/blog',
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
                {useVideo && videoUrl ? (
                  <Video {...getVideo(videoUrl)} />
                ) : (
                  <Media className={classes.heroImage} priority resource={image} />
                )}
              </div>
            )}
            {typeof image !== 'string' && (
              <div className={classes.mobileImage}>
                {useVideo && videoUrl ? (
                  <Video {...getVideo(videoUrl)} />
                ) : (
                  <Media className={classes.heroImage} priority resource={image} />
                )}
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
