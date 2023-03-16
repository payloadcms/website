'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { Gutter } from '@components/Gutter'
import DiscordGitCTA from '@components/DiscordGitCTA'
import OpenPost from '@components/OpenPost'
import { DiscordGitIntro } from '@components/DiscordGitIntro'
import { DiscordGitComments } from '@components/DiscordGitComments'
import * as cheerio from 'cheerio'

import classes from './index.module.scss'

export type Attachments = {
  attachment: string
  name: string
  size: number
  url: string
  proxyURL: string
  height: number
  width: number
  contentType:
    | 'image/png'
    | 'video/MP2T'
    | 'text/plain'
    | 'application/json'
    | 'video/quicktime'
    | 'image/jpeg'
  description: string
  ephemeral: boolean
}[]

export type Messages = {
  content: string
  fileAttachments: Attachments
  authorID: string
  authorName: string
  authorAvatar: string
  createdAtDate: string | number
}

export type ThreadProps = {
  info: {
    name: string
    id: string
    guildId: string
    createdAt: string | number
  }
  intro: Messages
  messageCount: number
  messages: Messages[]
  slug: string
}

export const RenderThread: React.FC<ThreadProps> = props => {
  const { info, intro, messageCount, messages } = props

  const author = intro.authorName

  const selectedAuthorAvatar = `https://cdn.discordapp.com/avatars/${intro.authorID}/${intro.authorAvatar}.png?size=256`
  const defaultAuthorAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
  const authorAvatarImg = intro.authorAvatar ? selectedAuthorAvatar : defaultAuthorAvatar

  const unwrappedOriginalMessage = cheerio.load(intro.content)

  unwrappedOriginalMessage('body')
    .contents()
    .filter(function () {
      return this.nodeType === 3
    })
    .wrap('<p></p>')

  const wrappedOriginalMessage = unwrappedOriginalMessage.html()

  const postUrl = `https://discord.com/channels/${info.guildId}/${info.id}`

  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={10} colsL={9} className={classes.post}>
            <DiscordGitIntro
              postName={info.name}
              author={author}
              image={authorAvatarImg}
              date={info.createdAt}
              messageCount={messageCount}
              content={wrappedOriginalMessage}
              attachments={intro.fileAttachments}
            />
            <DiscordGitComments comments={messages} />
            <OpenPost url={postUrl} platform="Discord" />
          </Cell>
        </Grid>
      </Gutter>
      <DiscordGitCTA />
    </HeaderObserver>
  )
}

export default RenderThread
