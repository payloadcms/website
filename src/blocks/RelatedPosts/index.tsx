import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { Gutter } from '@components/Gutter'
import { Post } from '@root/payload-types'

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
        <div className={['grid'].filter(Boolean).join(' ')}>
          {relatedPosts.map(
            (post, key) =>
              typeof post !== 'string' && (
                <div
                  key={key}
                  className={[
                    relatedPosts.length >= 3
                      ? 'cols-4 cols-m-4 cols-s-8'
                      : 'cols-16 start-1 cols-m-8',
                    `${colStart[key]} start-m-1`,
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
