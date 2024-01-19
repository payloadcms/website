'use client'

import React from 'react'

import { DiscordGitComments } from '@components/DiscordGitComments'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { DiscordGitIntro } from '@components/DiscordGitIntro'
import { Gutter } from '@components/Gutter'
import OpenPost from '@components/OpenPost'

import classes from './index.module.scss'

type DateFromSource = string
export type Author = {
  name?: string
  url?: string
  avatar?: string
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
  createdAt: DateFromSource
  chosenBy?: string
  chosenAt: DateFromSource
  replies?: Comment[] | null
}

export type DiscussionProps = {
  id: string
  title?: string
  slug?: string
  discordID?: string
  githubID?: string
  communityHelpType?: 'discord' | 'github'
  communityHelpJSON: {
    title: string
    id: string
    author: Author
    answer?: Answer
    body: string
    createdAt: DateFromSource
    url: string
    commentTotal: number
    upvotes: number
    comments: Comment[]
    slug: string
  }
}

export const GithubDiscussionPage: React.FC<DiscussionProps> = props => {
  const { communityHelpJSON } = props

  const { title, answer, author, body, createdAt, url, comments, commentTotal, upvotes, id } =
    communityHelpJSON

  return (
    <>
      <Gutter>
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[classes.post, 'cols-12 cols-l-10'].filter(Boolean).join(' ')}
            cols={10}
            colsL={9}
          >
            <DiscordGitIntro
              postName={title}
              author={author?.name}
              image={author?.avatar ? author?.avatar : '/images/avatars/default.png'}
              date={createdAt}
              messageCount={commentTotal}
              upvotes={upvotes}
              content={body}
              platform="GitHub"
            />
            <DiscordGitComments answer={answer} comments={comments} platform="GitHub" />
            <OpenPost url={url} platform="GitHub" />
          </div>
        </div>
      </Gutter>
      <DiscordGitCTA />
    </>
  )
}
