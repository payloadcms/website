import React, { Fragment } from 'react'
import AuthorTag from '@components/AuthorTag'
import Link from 'next/link'

import classes from './index.module.scss'

export type Props = {
  className?: string
  postUrl?: string
  postName?: string
  author?: string
  image: string
  date?: Date
  url?: string
  platform?: 'Github' | 'Discord'
  messageCount?: number
  upvotes?: number
}

export const DiscordGitIntro: React.FC<Props> = ({
  postUrl,
  postName,
  author,
  image,
  date,
  url,
  platform,
  messageCount,
  upvotes,
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
          url={url}
          platform={platform}
          messageCount={messageCount}
          upvotes={upvotes}
        />
      </div>
    </Fragment>
  )
}
