import type { Post } from '@root/payload-types'

import { ContentMediaCard } from '@components/cards/ContentMediaCard/index'
import { Gutter } from '@components/Gutter/index'

import classes from './index.module.scss'

export type RelatedPostsBlock = {
  blockName: string
  blockType: 'relatedPosts'
  disableGutter?: boolean
  id?: string
  relatedPosts: (Post | string)[] | null
  style?: 'default' | 'minimal'
}

export const RelatedPosts: React.FC<RelatedPostsBlock> = (props) => {
  const { id = '', disableGutter, relatedPosts, style } = props

  if (!relatedPosts || relatedPosts?.length === 0) {
    return null
  }

  return (
    <Gutter leftGutter={!disableGutter} rightGutter={!disableGutter}>
      <div
        className={[classes.relatedPosts, style && classes[style]].filter(Boolean).join(' ')}
        id={id}
      >
        <h4 className={classes.title}>Related Posts</h4>
        <div className={classes.grid}>
          {relatedPosts
            .filter((post) => typeof post !== 'string')
            .map((post) => {
              const postCategory =
                post.category && typeof post.category !== 'string' ? post.category.slug : 'blog'

              const thumbnailAsset =
                post.featuredMedia === 'upload'
                  ? post.image
                  : post.dynamicThumbnail
                    ? `/api/og?type=${postCategory}&title=${post.title}`
                    : post.thumbnail

              return (
                typeof post !== 'string' && (
                  <div className={['cols-8 cols-m-8'].filter(Boolean).join(' ')} key={post.id}>
                    <ContentMediaCard
                      authors={post.authorType === 'team' ? post.authors : post.guestAuthor}
                      href={`/posts/${postCategory}/${post.slug}`}
                      media={thumbnailAsset ?? ''}
                      publishedOn={post.publishedOn}
                      style={style}
                      title={post.title}
                    />
                  </div>
                )
              )
            })}
        </div>
      </div>
    </Gutter>
  )
}
