import React from 'react'
import * as cheerio from 'cheerio'

import AuthorTag from '@components/AuthorTag'
import { BackgroundScanline } from '@components/BackgroundScanline'
import { DiscordGitBody } from '@components/DiscordGitBody'
import { FileAttachments } from '@components/FileAttachment'
import { Messages } from '@root/app/community-help/(posts)/discord/[slug]/client_page'
import { Answer, Comment } from '@root/app/community-help/(posts)/github/[slug]/client_page'
import { CheckIcon } from '@root/icons/CheckIcon'

import classes from './index.module.scss'

export type CommentProps = {
  answer?: Answer
  comments?: Comment[] | Messages[]
  platform?: 'GitHub' | 'Discord'
}

export const DiscordGitComments: React.FC<CommentProps> = ({ answer, comments, platform }) => {
  const answerReplies = answer?.replies ? answer?.replies?.length : false
  return (
    <ul className={classes.comments}>
      {answer && answer?.body && (
        <li
          className={[classes.comment, classes.answer, answerReplies && classes.hasReplies]
            .filter(Boolean)
            .join(' ')}
        >
          <div className={classes.answerHeader}>
            <h6>Selected Answer</h6>
            <BackgroundScanline crosshairs={['top-left', 'top-right']} />
          </div>
          <div className={classes.answerBody}>
            <AuthorTag
              className={classes.answerAuthor}
              author={answer.author.name}
              image={answer.author.avatar}
              date={answer.createdAt}
              isAnswer
            />
            <DiscordGitBody body={answer?.body} platform={platform} />
            {answerReplies && (
              <div className={classes.replyCount}>
                {answerReplies} repl{answerReplies > 1 ? 'ies' : 'y'}
              </div>
            )}
          </div>
          <BackgroundScanline
            className={classes.crosshairs}
            crosshairs={['bottom-left', 'bottom-right']}
          />
        </li>
      )}

      {answerReplies &&
        answer?.replies?.map((reply, replyIndex) => {
          return (
            <li key={replyIndex} className={classes.reply}>
              <AuthorTag
                author={reply.author.name}
                image={reply.author.avatar}
                date={reply.createdAt}
              />
              <DiscordGitBody body={reply.body} platform={platform} />
            </li>
          )
        })}

      {comments &&
        comments.map((comment, index) => {
          const totalReplies = comment?.replies ? comment?.replies?.length : false
          if (answer && comment?.body === answer?.body) return null

          let body = ''

          if (comment.content) {
            const unwrappedMessage = cheerio.load(comment.content)

            unwrappedMessage('body')
              .contents()
              .filter(function () {
                return this.nodeType === 3
              })
              .wrap('<p></p>')

            body = unwrappedMessage.html()
          } else {
            body = comment.body
          }

          const avatarImg = comment.authorAvatar
            ? `https://cdn.discordapp.com/avatars/${comment.authorID}/${comment.authorAvatar}.png?size=48`
            : 'https://cdn.discordapp.com/embed/avatars/0.png'

          const hasFileAttachments =
            comment.fileAttachments &&
            Array.isArray(comment.fileAttachments) &&
            comment.fileAttachments.length > 0

          return (
            <li key={index} className={classes.commentWrap}>
              <div
                className={[classes.comment, totalReplies && classes.hasReplies]
                  .filter(Boolean)
                  .join(' ')}
              >
                <AuthorTag
                  author={comment.author?.name || comment.authorName}
                  image={comment.author?.avatar || avatarImg}
                  date={comment?.createdAt || comment.createdAtDate}
                />
                <DiscordGitBody body={body} platform={platform} />

                {hasFileAttachments && <FileAttachments attachments={comment.fileAttachments} />}

                {totalReplies && (
                  <div className={classes.replyCount}>
                    {totalReplies} repl{totalReplies > 1 ? 'ies' : 'y'}
                  </div>
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
                      />
                      <DiscordGitBody body={reply.body} platform={platform} />
                    </div>
                  )
                })}
            </li>
          )
        })}
    </ul>
  )
}
