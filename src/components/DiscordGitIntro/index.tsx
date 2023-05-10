import React, { Fragment } from 'react'
import Link from 'next/link'

import AuthorTag from '@components/AuthorTag'
import { DiscordGitBody } from '@components/DiscordGitBody'
import { FileAttachments } from '@components/FileAttachment'
import { Attachments } from '@root/app/community-help/discord/[slug]/client_page'

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
  platform?: 'Discord' | 'GitHub'
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
  platform,
}) => {
  const hasFileAttachments = attachments && Array.isArray(attachments) && attachments.length > 0

  return (
    <Fragment>
      <div className={classes.breadcrumbWrap}>
        <Link className={classes.breadcrumb} href="/community-help" prefetch={false}>
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
      <DiscordGitBody body={content} platform={platform} />
      {hasFileAttachments && <FileAttachments attachments={attachments} />}
    </Fragment>
  )
}
