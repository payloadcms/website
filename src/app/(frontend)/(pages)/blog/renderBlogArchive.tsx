'use client'

import type { Post } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockSpacing } from '@components/BlockSpacing/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { ContentMediaCard } from '@components/cards/ContentMediaCard/index.js'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import { FeaturedBlogPost } from '@components/FeaturedBlogPost/index.js'
import { Gutter } from '@components/Gutter/index.js'
import React from 'react'

import classes from './index.module.scss'

export const RenderBlogArchive: React.FC<{ posts: Partial<Post>[] }> = ({ posts }) => {
  const latestPost = posts[0]
  return (
    <React.Fragment>
      <BreadcrumbsBar
        breadcrumbs={[{ label: 'Blog' }]}
        links={[
          { label: 'Guides', url: '/guides' },
          { label: 'Case Studies', url: '/case-studies' },
        ]}
      />
      <BlockWrapper padding={{ bottom: 'large', top: 'hero' }} settings={{}}>
        <BackgroundGrid zIndex={0} />
        <Gutter>
          <div className={[classes.hero].filter(Boolean).join(' ')}>
            <div className={[classes.heroContent, 'grid'].filter(Boolean).join(' ')}>
              <h2 className={[classes.title, 'cols-8 cols-m-8'].filter(Boolean).join(' ')}>
                Keep tabs on Payload
              </h2>
              <p
                className={[classes.description, 'cols-4 start-13 start-m-1 cols-m-8']
                  .filter(Boolean)
                  .join(' ')}
              >{`Here, you'll find news about feature releases, happenings in the industry, and Payload announcements in general.`}</p>
            </div>
          </div>

          <FeaturedBlogPost {...latestPost} />
          <div className={[classes.cardGrid, 'grid'].filter(Boolean).join(' ')}>
            {(posts || []).slice(1).map((blogPost) => {
              const { id, slug, authors, image, publishedOn, title } = blogPost

              if (!id || !title || !publishedOn || !slug || !image || !authors) {
                return null
              }

              return (
                <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={id}>
                  <ContentMediaCard
                    authors={authors}
                    href={`/blog/${slug}`}
                    media={image}
                    publishedOn={publishedOn}
                    title={title}
                  />
                </div>
              )
            })}
          </div>
        </Gutter>
      </BlockWrapper>
    </React.Fragment>
  )
}

export default RenderBlogArchive
