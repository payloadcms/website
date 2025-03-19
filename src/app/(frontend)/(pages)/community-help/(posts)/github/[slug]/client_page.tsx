'use client'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { DiscordGitComments } from '@components/DiscordGitComments/index'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index'
import { DiscordGitIntro } from '@components/DiscordGitIntro/index'
import { Gutter } from '@components/Gutter/index'
import OpenPost from '@components/OpenPost/index'
import React from 'react'

import classes from './index.module.scss'

type DateFromSource = string
export type Author = {
  avatar?: string
  name?: string
  url?: string
}
export type Comment = {
  author: Author
  body: string
  createdAt: DateFromSource
  replies?: Comment[] | null
}

export type Answer = {
  author: Author
  body: string
  chosenAt: DateFromSource
  chosenBy?: string
  createdAt: DateFromSource
  replies?: Comment[] | null
}

export type DiscussionProps = {
  communityHelpJSON: {
    answer?: Answer
    author: Author
    body: string
    comments: Comment[]
    commentTotal: number
    createdAt: DateFromSource
    id: string
    slug: string
    title: string
    upvotes: number
    url: string
  }
  communityHelpType?: 'discord' | 'github'
  discordID?: string
  githubID?: string
  id: string
  slug?: string
  title?: string
}

export const GithubDiscussionPage: React.FC<DiscussionProps> = (props) => {
  const { communityHelpJSON } = props

  const { id, answer, author, body, comments, commentTotal, createdAt, title, upvotes, url } =
    communityHelpJSON

  return (
    <div className={classes.wrap}>
      <BackgroundGrid className={classes.bg} />
      <Gutter>
        <div className={['grid', classes.grid].join(' ')}>
          <div className={['start-1 cols-12 ', classes.post].join('')}>
            <DiscordGitIntro
              author={author?.name}
              content={body}
              date={createdAt}
              image={author?.avatar ? author?.avatar : '/images/avatars/default.png'}
              messageCount={commentTotal}
              platform="GitHub"
              postName={title}
              upvotes={upvotes}
            />
            <DiscordGitComments answer={answer} comments={comments} platform="GitHub" />
            <div className={classes.openPostWrap}>
              <OpenPost platform="GitHub" url={url} />
            </div>
          </div>
          <div className={['start-13 cols-4', classes.ctaWrap].join(' ')}>
            <DiscordGitCTA appearance="default" />
          </div>
        </div>
      </Gutter>
    </div>
  )
}
