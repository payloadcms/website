import React, { Fragment } from 'react'
import Link from 'next/link'

import AuthorTag from '@components/AuthorTag'
import { DiscordGitBody } from '@components/DiscordGitBody'

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
}

export const DiscordGitIntro: React.FC<Props> = ({
  postName,
  author,
  image,
  date,
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
    </Fragment>
  )
}
