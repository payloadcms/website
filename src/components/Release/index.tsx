import type { Release as ReleaseType } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { Breadcrumbs } from '@components/Breadcrumbs/index'
import { Gutter } from '@components/Gutter/index'
import { Media } from '@components/Media/index'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { RichText } from '@components/RichText/index'
import { ArrowRightIcon } from '@icons/ArrowRightIcon/index'
import { formatDate } from '@utilities/format-date-time'
import Link from 'next/link'
import React from 'react'

import { AuthorsList } from '../Post/AuthorsList/index'
import classes from './index.module.scss'
import { ReleaseMarkdown } from './ReleaseMarkdown/index'

export const Release: React.FC<Partial<ReleaseType>> = (props) => {
  const { authors, content, excerpt, githubUrl, image, publishedOn, title } = props

  const ogImageUrl = `/api/og?type=releases&title=${encodeURIComponent(title || '')}`

  return (
    <div className={classes.release} id="release">
      <BackgroundGrid wideGrid />
      <Gutter>
        <div className={[classes.grid, 'grid'].filter(Boolean).join(' ')}>
          <div className={[classes.stickyColumn, 'cols-3 start-1'].filter(Boolean).join(' ')}>
            <div className={classes.stickyContent}>
              <AuthorsList authors={authors} />
              {githubUrl && (
                <Link
                  className={classes.githubLink}
                  href={githubUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  View on GitHub →
                </Link>
              )}
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
                      label: (
                        <span className={classes.allReleases}>
                          <ArrowRightIcon />
                          Releases
                        </span>
                      ),
                      url: '/posts/releases',
                    },
                    {
                      ...(publishedOn && {
                        label: <time>{formatDate({ date: publishedOn })}</time>,
                      }),
                    },
                  ]}
                />
                <h1 className={classes.title}>{title}</h1>
              </div>
              <div className={classes.mobileAuthor}>
                <AuthorsList authors={authors} />
              </div>
            </div>
            <div className={classes.heroImageWrap}>
              {image && typeof image !== 'string' ? (
                <Media className={classes.heroImage} priority resource={image} />
              ) : (
                <img alt={title || 'Release'} className={classes.heroImage} src={ogImageUrl} />
              )}
            </div>
            {excerpt && <RichText className={classes.excerpt} content={excerpt} />}
            <div className={classes.blocks}>
              {(content || []).map((block, i) => {
                if (block.blockType === 'blogMarkdown' && block.blogMarkdownFields?.markdown) {
                  return (
                    <div className={classes.markdownContent} key={block.id || i}>
                      <ReleaseMarkdown markdown={block.blogMarkdownFields.markdown} />
                    </div>
                  )
                }
                return null
              })}
              <RenderBlocks
                blocks={(content || []).filter((b) => b.blockType !== 'blogMarkdown')}
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
