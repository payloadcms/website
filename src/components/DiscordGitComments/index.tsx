import React from 'react'
import AuthorTag from '@components/AuthorTag'
import { CheckmarkIcon } from '@root/graphics/CheckmarkIcon'
import { FileAttachment } from '@components/FileAttachment'
import { DiscordGitBody } from '@components/DiscordGitBody'
import { Answer, Comment } from '@root/app/community-help/github/[discussion]/render'
import { Messages } from '@root/app/community-help/discord/[thread]/render'

import classes from './index.module.scss'

export type CommentProps = {
  answer?: Answer
  comments?: Comment[] | Messages[]
}

export const DiscordGitComments: React.FC<CommentProps> = ({ answer, comments }) => {
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
            <CheckmarkIcon className={classes.checkmark} />
            <label>Selected Answer</label>
          </div>

          <div className={classes.answerBody}>
            <AuthorTag
              className={classes.answerAuthor}
              author={answer.author.name}
              image={answer.author.avatar}
              date={answer.createdAt}
              isAnswer
            />
            <DiscordGitBody body={answer?.body} />
          </div>
          {answerReplies && (
            <div className={classes.replyCount}>
              {answerReplies} repl{answerReplies > 1 ? 'ies' : 'y'}
            </div>
          )}
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
              <DiscordGitBody body={reply.body} />
            </li>
          )
        })}

      {comments &&
        comments.map((comment, index) => {
          const totalReplies = comment?.replies ? comment?.replies?.length : false
          if (answer && comment?.body === answer?.body) return null

          const avatarImg = comment.authorAvatar
            ? `https://cdn.discordapp.com/avatars/${comment.authorID}/${comment.authorAvatar}.png?size=256`
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
                <DiscordGitBody body={comment.body || comment.content} />

                {hasFileAttachments && (
                  <div className={classes.attachmentWrap}>
                    {comment.fileAttachments.map((fileAttachment, x) => {
                      return (
                        <FileAttachment
                          key={x}
                          url={fileAttachment?.url}
                          name={fileAttachment?.name}
                          width={fileAttachment?.width}
                          height={fileAttachment?.height}
                          contentType={fileAttachment?.contentType}
                        />
                      )
                    })}
                  </div>
                )}

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
                      <DiscordGitBody body={reply.body} />
                    </div>
                  )
                })}
            </li>
          )
        })}
    </ul>
  )
}
