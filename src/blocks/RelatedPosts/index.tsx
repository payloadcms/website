import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { Gutter } from '@components/Gutter'
import { Post } from '@root/payload-types'

import classes from './index.module.scss'

export type RelatedPostsBlock = {
  blockType: 'relatedPosts'
  blockName: string
  relatedPosts: (Post | string)[] | null
  id?: string
}

export const RelatedPosts: React.FC<RelatedPostsBlock> = props => {
  const { relatedPosts, id = '' } = props

  if (!relatedPosts || relatedPosts?.length === 0) {
    return null
  }

  return (
    <Gutter>
      <div className={classes.relatedPosts} id={id}>
        <h4 className={classes.title}>Related Posts</h4>
        <div className={['grid'].filter(Boolean).join(' ')}>
          {relatedPosts.map(
            (post, key) =>
              typeof post !== 'string' && (
                <div
                  key={key}
                  className={[
                    relatedPosts.length >= 3
                      ? 'cols-4 cols-m-4 cols-s-8'
                      : 'cols-12 start-1 cols-m-8',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <ContentMediaCard
                    title={post.title}
                    description={post?.meta?.description}
                    href={`/blog/${post.slug}`}
                    media={post.image}
                    orientation={relatedPosts.length < 3 ? 'horizontal' : undefined}
                  />
                </div>
              ),
          )}
        </div>
      </div>
    </Gutter>
  )
}
