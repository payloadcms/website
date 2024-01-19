'use client'

import React from 'react'

import { BlockSpacing } from '@components/BlockSpacing'
import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { Gutter } from '@components/Gutter'
import { DefaultHero } from '@components/Hero/Default'
import { Post } from '@root/payload-types'

export const RenderBlogArchive: React.FC<{ posts: Post[] }> = ({ posts }) => {
  return (
    <React.Fragment>
      <DefaultHero
        richText={[
          {
            type: 'h2',
            children: [
              {
                text: 'Keep tabs on Payload.',
              },
            ],
          },
          {
            text: 'Here, you’ll find news about feature releases, happenings in the industry, and Payload announcements in general.',
          },
        ]}
      />
      <Gutter>
        <BlockSpacing>
          <div className={['grid'].filter(Boolean).join(' ')}>
            {(posts || []).map(blogPost => {
              return (
                <div key={blogPost.id} className={['cols-4 cols-s-8'].filter(Boolean).join(' ')}>
                  <ContentMediaCard
                    title={blogPost.title}
                    description={blogPost?.meta?.description}
                    href={`/blog/${blogPost.slug}`}
                    media={blogPost.image}
                  />
                </div>
              )
            })}
          </div>
        </BlockSpacing>
      </Gutter>
    </React.Fragment>
  )
}

export default RenderBlogArchive
