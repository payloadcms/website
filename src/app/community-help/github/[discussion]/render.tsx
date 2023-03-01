'use client'

import React from 'react'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import AuthorTag from '@components/AuthorTag'
import { Gutter } from '@components/Gutter'
import { CheckmarkIcon } from '@root/graphics/CheckmarkIcon'
import getRelativeDate from '@root/utilities/get-relative-date'
import DiscordGitCTA from '@components/DiscordGitCTA'
import OpenPost from '@components/OpenPost'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Meta from '@components/Meta'
import { DiscordGitIntro } from '@components/DiscordGitIntro'

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
  replies?: Comment[]
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
  const { title, answer, author, body, createdAt, url, comments, commentTotal, upvotes, id } = props

  const theme = useTheme()

  return (
    <>
      <Meta
        title={`${title} | Payload CMS`}
        description={title}
        slug={`community-help/github/${id}`}
      />
      <HeaderObserver color={theme} pullUp>
        <Gutter>
          <Grid>
            <Cell cols={10} colsL={9} className={classes.post}>
              <DiscordGitIntro
                postUrl={url}
                postName={title}
                author={author.name}
                image={author.avatar}
                date={createdAt}
                url={author.url}
                platform="Github"
                messageCount={commentTotal}
                upvotes={upvotes}
              />

              <div
                className={[classes.body, classes.discussionBody].join(' ')}
                dangerouslySetInnerHTML={{ __html: body }}
              />

              {comments && comments.length > 0 && (
                <ul className={classes.comments}>
                  {answer.body && (
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
                        className={classes.answerAuthor}
                        author={answer.author.name}
                        image={answer.author.avatar}
                        date={answer.createdAt}
                        url={answer.author.url}
                      />
                      <div
                        className={classes.body}
                        dangerouslySetInnerHTML={{ __html: answer.body }}
                      />
                    </li>
                  )}
                  {comments.map((comment, index) => {
                    const totalReplies = comment.replies ? comment.replies.length : false
                    if (answer && comment.body === answer.body) return null
                    return (
                      <li key={index} className={classes.commentWrap}>
                        <div
                          className={[classes.comment, totalReplies && classes.hasReplies]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          <AuthorTag
                            author={comment.author.name}
                            image={comment.author.avatar}
                            date={comment.createdAt}
                            url={comment.author.url}
                          />
                          <div
                            className={classes.body}
                            dangerouslySetInnerHTML={{ __html: comment.body }}
                          />
                          {totalReplies && (
                            <span className={classes.replyCount}>
                              {totalReplies} repl{totalReplies > 1 ? 'ies' : 'y'}
                            </span>
                          )}
                        </div>

                        {totalReplies &&
                          comment.replies.map((reply, replyIndex) => {
                            return (
                              <div key={replyIndex} className={classes.reply}>
                                <AuthorTag
                                  author={reply.author.name}
                                  image={reply.author.avatar}
                                  date={reply.createdAt}
                                  url={reply.author.url}
                                />
                                <div
                                  className={classes.body}
                                  dangerouslySetInnerHTML={{ __html: reply.body }}
                                />
                              </div>
                            )
                          })}
                      </li>
                    )
                  })}
                </ul>
              )}

              <OpenPost url={url} platform="GitHub" />
            </Cell>
          </Grid>
        </Gutter>
        <DiscordGitCTA />
      </HeaderObserver>
    </>
  )
}

export default RenderDiscussion
