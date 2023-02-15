'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import AuthorTag from '@components/AuthorTag'
import { Gutter } from '@components/Gutter'

import classes from './index.module.scss'

export type Author = {
  name: string
  url: string
  avatar: string
}

export type DiscussionProps = {
  title: string
  id: string
  author: Author
  body: string
  createdAt: Date
  url: string
  commentTotal: number
  upvotes: number
  comments: {
    author: Author
    body: string
    createdAt: Date
  }[]
}

export const RenderDiscussion: React.FC<DiscussionProps> = props => {
  const { title, id, author, body, createdAt, url, comments, commentTotal, upvotes } = props

  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Breadcrumbs
          items={[
            {
              label: 'Community Help',
              url: '/community-help',
            },
            {
              label: 'GitHub',
              url: '/community-help/github',
            },
          ]}
        />
      </Gutter>

      <Gutter>
        <Grid>
          <Cell start={1} cols={9} colsL={8} colsM={5} colsS={12}>
            <h1 className={classes.title}>{title}</h1>

            <div className={classes.details}>
              <AuthorTag
                author={author.name}
                image={author.avatar}
                date={createdAt}
                url={url}
                platform="Github"
              />
              <div className={classes.upvotes}>
                <ArrowIcon rotation={-45} /> {upvotes}
              </div>
              <div className={classes.comments}>
                <CommentsIcon /> {commentTotal}
              </div>
            </div>

            <div dangerouslySetInnerHTML={{ __html: body }} />

            <div>
              <ul className={classes.commentWrap}>
                {comments.map((comment, i) => {
                  return (
                    <li key={i} className={classes.comment}>
                      <div className={classes.commentAuthor}>
                        <AuthorTag
                          author={comment.author.name}
                          image={comment.author.avatar}
                          date={comment.createdAt}
                          url={comment.author.url}
                        />
                      </div>
                      <div dangerouslySetInnerHTML={{ __html: comment.body }} />
                    </li>
                  )
                })}
              </ul>
            </div>
          </Cell>

          <Cell start={10} cols={3} startL={9} colsL={4} startM={6} colsM={3} startS={1} colsS={8}>
            <h5>CTA</h5>
          </Cell>
        </Grid>
      </Gutter>
    </HeaderObserver>
  )
}

export default RenderDiscussion
