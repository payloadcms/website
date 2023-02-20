'use client'

import React from 'react'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import AuthorTag from '@components/AuthorTag'
import { Gutter } from '@components/Gutter'
import { CheckmarkIcon } from '@root/graphics/CheckmarkIcon'
import getRelativeDate from '@root/utilities/get-relative-date'
import DiscordGitCTA from '@components/DiscordGitCTA'
import classes from './index.module.scss'

export type Author = {
  name: string
  url: string
  avatar: string
}

export type Comment = {
  author: Author
  body: string
  createdAt: Date
}

export type DiscussionProps = {
  title: string
  id: string
  author: Author
  answer?: {
    author: Author
    body: string
    createdAt: Date
    chosenBy: Author
    chosenAt: Date
  }
  body: string
  createdAt: Date
  url: string
  commentTotal: number
  upvotes: number
  comments: Comment[]
}

export const RenderDiscussion: React.FC<DiscussionProps> = props => {
  const { title, answer, author, body, createdAt, url, comments, commentTotal, upvotes } = props

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

      <Gutter className={classes.wrap}>
        <div className={classes.content}>
          <h1 className={classes.title}>{title}</h1>
          <div className={classes.details}>
            <AuthorTag
              author={author.name}
              image={author.avatar}
              date={createdAt}
              url={url}
              platform="Github"
            />
            {upvotes && (
              <div className={classes.upvotes}>
                <ArrowIcon rotation={-45} /> {upvotes}
              </div>
            )}
            {comments && (
              <div className={classes.comments}>
                <CommentsIcon /> {commentTotal}
              </div>
            )}
          </div>

          <div className={classes.discussionBody} dangerouslySetInnerHTML={{ __html: body }} />

          <ul className={classes.commentWrap}>
            {answer && (
              <li className={[classes.comment, classes.answer].join(' ')}>
                <div className={classes.answerLabel}>
                  <CheckmarkIcon className={classes.checkmark} />
                  <label>Answer</label>
                  <span className={classes.selectedBy}>
                    {`selected by ${answer.chosenBy} `}
                    {getRelativeDate(answer.chosenAt)}
                  </span>
                </div>
                <AuthorTag
                  author={answer.author.name}
                  image={answer.author.avatar}
                  date={answer.createdAt}
                  url={answer.author.url}
                />
                <div
                  className={classes.answerBody}
                  dangerouslySetInnerHTML={{ __html: answer.body }}
                />
              </li>
            )}
            {comments.map((comment, i) => {
              if (answer && comment.body === answer.body) return null
              return (
                <li key={i} className={classes.comment}>
                  <AuthorTag
                    author={comment.author.name}
                    image={comment.author.avatar}
                    date={comment.createdAt}
                    url={comment.author.url}
                  />
                  <div
                    className={classes.commentBody}
                    dangerouslySetInnerHTML={{ __html: comment.body }}
                  />
                </li>
              )
            })}
          </ul>
        </div>

        <DiscordGitCTA />
      </Gutter>
    </HeaderObserver>
  )
}

export default RenderDiscussion
