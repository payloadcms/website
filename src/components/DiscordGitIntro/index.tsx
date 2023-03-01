import React, { Fragment } from 'react'
import AuthorTag from '@components/AuthorTag'
import Link from 'next/link'
import { DiscordGitBody } from '@components/DiscordGitBody'
import classes from './index.module.scss'

export type Props = {
  className?: string
  postUrl?: string
  postName?: string
  author?: string
  image: string
  date?: Date
  platform?: 'Github' | 'Discord'
  messageCount?: number
  upvotes?: number
  content?: string
}

export const DiscordGitIntro: React.FC<Props> = ({
  postUrl,
  postName,
  author,
  image,
  date,
  platform,
  messageCount,
  upvotes,
  content,
}) => {
  return (
    <Fragment>
      <div className={classes.breadcrumbWrap}>
        <Link className={classes.breadcrumb} href="/community-help">
          Community Help
        </Link>
      </div>
      <a className={classes.title} href={postUrl} rel="noopener noreferrer" target="_blank">
        <h3>{postName}</h3>
      </a>
      <div className={classes.authorDetails}>
        <AuthorTag
          author={author}
          image={image}
          date={date}
          platform={platform}
          messageCount={messageCount}
          upvotes={upvotes}
        />
      </div>
      <DiscordGitBody body={content} />
    </Fragment>
  )
}
