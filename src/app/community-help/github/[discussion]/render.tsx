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

export type Author = {
  name: string
  url: string
  avatar: string
}
export type Comment = {
  author: Author
  body: string
  createdAt: Date
  replies?: Comment[]
}

export type Answer = {
  author: Author
  body: string
  createdAt: Date
  chosenBy: Author
  chosenAt: Date
  replies?: Comment[]
}

export type DiscussionProps = {
  title: string
  id: string
  author: Author
  answer?: Answer
  body: string
  createdAt: Date
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
                postUrl={url}
                postName={title}
                author={author.name}
                image={author.avatar}
                date={createdAt}
                platform="Github"
                messageCount={commentTotal}
                upvotes={upvotes}
                content={body}
              />
              <DiscordGitComments answer={answer} comments={comments} platform="Github" />
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
