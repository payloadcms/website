import { Cell, Grid } from '@faceless-ui/css-grid'
import { CellProps } from '@faceless-ui/css-grid/dist/Cell'

import { ContentMediaCard } from '@components/cards/ContentMediaCard'
import { Gutter } from '@components/Gutter'
import { Post } from '@root/payload-types'

import classes from './index.module.scss'

export type RelatedPostsBlock = {
  blockType: 'relatedPosts'
  blockName: string
  relatedPosts: Post[]
}

export const RelatedPosts: React.FC<{ relatedPosts: Post[] }> = props => {
  const { relatedPosts } = props

  if (!relatedPosts || relatedPosts?.length === 0) {
    return null
  }

  let cellProps: Partial<CellProps> = {
    start: 1,
    cols: 12,
  }

  if (relatedPosts.length >= 3) {
    cellProps = {
      cols: 4,
      colsM: 6,
    }
  }

  return (
    <Gutter className={classes.relatedPosts}>
      <h4 className={classes.title}>Related Posts</h4>
      <Grid>
        {relatedPosts.map((post, key) => (
          <Cell key={key} {...cellProps}>
            <ContentMediaCard
              title={post.title}
              description={post?.meta?.description}
              href={`/blog/${post.slug}`}
              media={post.image}
              orientation={relatedPosts.length < 3 ? 'horizontal' : undefined}
            />
          </Cell>
        ))}
      </Grid>
    </Gutter>
  )
}
