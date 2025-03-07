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
}

export const RelatedPosts: React.FC<RelatedPostsBlock> = (props) => {
  const { id = '', disableGutter, relatedPosts } = props

  if (!relatedPosts || relatedPosts?.length === 0) {
    return null
  }

  const colStart = {
    0: 'start-1',
    1: 'start-6',
    2: 'start-11',
  }

  return (
    <Gutter leftGutter={!disableGutter} rightGutter={!disableGutter}>
      <div className={classes.relatedPosts} id={id}>
        <h4 className={classes.title}>Related Posts</h4>
        <div className={classes.grid}>
          {relatedPosts.map(
            (post, key) =>
              typeof post !== 'string' && (
                <ContentMediaCard
                  authors={post.authors}
                  description={post?.meta?.description}
                  href={`/blog/${post.slug}`}
                  key={key}
                  media={post.image}
                  orientation={relatedPosts.length < 3 ? 'horizontal' : undefined}
                  publishedOn={post.publishedOn}
                  title={post.title}
                />
              ),
          )}
        </div>
      </div>
    </Gutter>
  )
}
