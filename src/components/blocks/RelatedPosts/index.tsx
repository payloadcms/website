import { ContentMediaCard } from '@components/cards/ContentMediaCard/index.js'
import { Gutter } from '@components/Gutter/index.js'
import { Post } from '@root/payload-types.js'

import classes from './index.module.scss'

export type RelatedPostsBlock = {
  blockType: 'relatedPosts'
  blockName: string
  relatedPosts: (Post | string)[] | null
  id?: string
  disableGutter?: boolean
}

export const RelatedPosts: React.FC<RelatedPostsBlock> = props => {
  const { relatedPosts, id = '', disableGutter } = props

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
                  title={post.title}
                  description={post?.meta?.description}
                  href={`/blog/${post.slug}`}
                  media={post.image}
                  publishedOn={post.publishedOn}
                  authors={post.authors}
                  orientation={relatedPosts.length < 3 ? 'horizontal' : undefined}
                  key={key}
                />
              ),
          )}
        </div>
      </div>
    </Gutter>
  )
}
