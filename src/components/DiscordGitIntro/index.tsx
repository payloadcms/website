import type { Attachments } from '@root/app/(frontend)/(pages)/community-help/(posts)/discord/[slug]/client_page.js'

import AuthorTag from '@components/AuthorTag/index.js'
import { DiscordGitBody } from '@components/DiscordGitBody/index.js'
import { FileAttachments } from '@components/FileAttachment/index.js'
import Link from 'next/link'
import React, { Fragment } from 'react'

import classes from './index.module.scss'

export type Props = {
  attachments?: Attachments
  author?: string
  className?: string
  content?: string
  date?: number | string
  image: string
  messageCount?: number
  platform?: 'Discord' | 'GitHub'
  postName?: string
  upvotes?: number
}

export const DiscordGitIntro: React.FC<Props> = ({
  attachments,
  author,
  content,
  date,
  image,
  messageCount,
  platform,
  postName,
  upvotes,
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
          date={date}
          image={image}
          messageCount={messageCount}
          upvotes={upvotes}
        />
      </div>
      <DiscordGitBody body={content} platform={platform} />
      {hasFileAttachments && <FileAttachments attachments={attachments} />}
      <div className={classes.divider} />
    </Fragment>
  )
}
