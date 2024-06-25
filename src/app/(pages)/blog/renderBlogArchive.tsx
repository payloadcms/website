'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockSpacing } from '@components/BlockSpacing/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { ContentMediaCard } from '@components/cards/ContentMediaCard/index.js'
import { FeaturedBlogPost } from '@components/FeaturedBlogPost/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Post } from '@root/payload-types.js'

import classes from './index.module.scss'

export const RenderBlogArchive: React.FC<{ posts: Post[] }> = ({ posts }) => {
  const latestPost = posts[0]
  return (
    <React.Fragment>
      <BlockWrapper settings={{}} padding={{ top: 'hero', bottom: 'large' }}>
        <BackgroundGrid zIndex={0} />
        <Gutter>
          <div className={[classes.hero].filter(Boolean).join(' ')}>
            <div>
              <h1 className={[classes.pageTitle].filter(Boolean).join(' ')}>Blog</h1>
            </div>
            <div className={[classes.heroContent, 'grid'].filter(Boolean).join(' ')}>
              <h2 className={[classes.title, 'cols-8 cols-m-8'].filter(Boolean).join(' ')}>
                Keep tabs on Payload
              </h2>
              <p
                className={[classes.description, 'cols-4 start-13 start-m-1 cols-m-8']
                  .filter(Boolean)
                  .join(' ')}
              >{`Here, you’ll find news about feature releases, happenings in the industry, and Payload announcements in general.`}</p>
            </div>
          </div>

          <FeaturedBlogPost {...latestPost} />
          <div className={[classes.cardGrid, 'grid'].filter(Boolean).join(' ')}>
            {(posts || []).slice(1).map(blogPost => {
              return (
                <div key={blogPost.id} className={['cols-8 cols-m-8'].filter(Boolean).join(' ')}>
                  <ContentMediaCard
                    title={blogPost.title}
                    publishedOn={blogPost.publishedOn}
                    href={`/blog/${blogPost.slug}`}
                    media={blogPost.image}
                    authors={blogPost.authors}
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
