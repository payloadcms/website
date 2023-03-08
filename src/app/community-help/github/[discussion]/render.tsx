'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useTheme } from '@providers/Theme'

import { DiscordGitComments } from '@components/DiscordGitComments'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { DiscordGitIntro } from '@components/DiscordGitIntro'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import Meta from '@components/Meta'
import OpenPost from '@components/OpenPost'

import classes from './index.module.scss'

type DateFromSource = string | number
export type Author = {
  name: string
  url: string
  avatar: string
}
export type Comment = {
  author: Author
  body: string
  createdAt: DateFromSource
  replies?: Comment[]
}

export type Answer = {
  author: Author
  body: string
  createdAt: DateFromSource
  chosenBy: Author
  chosenAt: DateFromSource
  replies?: Comment[]
}

export type DiscussionProps = {
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
}

export const RenderDiscussion: React.FC<DiscussionProps> = props => {
  const { title, answer, author, body, createdAt, url, comments, commentTotal, upvotes, id } = props

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
                image={author.avatar}
                date={createdAt}
                messageCount={commentTotal}
                upvotes={upvotes}
                content={body}
              />
              <DiscordGitComments answer={answer} comments={comments} />
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
