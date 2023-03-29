'use client'

import React from 'react'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { Gutter } from '@components/Gutter'
import DiscordGitCTA from '@components/DiscordGitCTA'
import OpenPost from '@components/OpenPost'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Meta from '@components/Meta'
import { DiscordGitIntro } from '@components/DiscordGitIntro'

import { DiscordGitComments } from '@components/DiscordGitComments'
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

export const RenderDiscussion: React.FC<DiscussionProps> = props => {
  const { communityHelpJSON } = props

  const { title, answer, author, body, createdAt, url, comments, commentTotal, upvotes, id } = communityHelpJSON

  const theme = useTheme()

  return (
    <>
      <Meta
        title={`${title} | Payload CMS`}
        description={title}
        slug={`community-help/github/${id}`}
      />
      <HeaderObserver color={theme} pullUp>
        <Gutter>
          <Grid>
            <Cell cols={10} colsL={9} className={classes.post}>
              <DiscordGitIntro
                postName={title}
                author={author.name}
                image={author.avatar ? author.avatar : '/images/avatars/default.png'}
                date={createdAt}
                messageCount={commentTotal}
                upvotes={upvotes}
                content={body}
                platform="GitHub"
              />
              <DiscordGitComments answer={answer} comments={comments} platform="GitHub" />
              <OpenPost url={url} platform="GitHub" />
            </Cell>
          </Grid>
        </Gutter>
        <DiscordGitCTA />
      </HeaderObserver>
    </>
  )
}

export default RenderDiscussion
