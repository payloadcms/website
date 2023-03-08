import React, { Fragment } from 'react'
import AuthorTag from '@components/AuthorTag'
import Link from 'next/link'
import { DiscordGitBody } from '@components/DiscordGitBody'
import { FileAttachments } from '@components/FileAttachment'
import { Attachments } from '@root/app/community-help/discord/[thread]/render'
import classes from './index.module.scss'

export type Props = {
  className?: string
  postName?: string
  author?: string
  image: string
  date?: string | number
  messageCount?: number
  upvotes?: number
  content?: string
  attachments?: Attachments
}

export const DiscordGitIntro: React.FC<Props> = ({
  postName,
  author,
  image,
  date,
  messageCount,
  upvotes,
  content,
  attachments,
}) => {
  const hasFileAttachments = attachments && Array.isArray(attachments) && attachments.length > 0

  return (
    <Fragment>
      <div className={classes.breadcrumbWrap}>
        <Link className={classes.breadcrumb} href="/community-help">
          Community Help
        </Link>
      </div>
      <h1 className={classes.title}>{postName}</h1>
      <div className={classes.authorDetails}>
        <AuthorTag
          author={author}
          image={image}
          date={date}
          messageCount={messageCount}
          upvotes={upvotes}
        />
      </div>
      <DiscordGitBody body={content} />
      {hasFileAttachments && <FileAttachments attachments={attachments} />}
    </Fragment>
  )
}
