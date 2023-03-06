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
import classes from './index.module.scss'

export type Attachments = {
  attachment: string
  name: string
  size: number
  url: string
  proxyURL: string
  height: number
  width: number
  contentType: 'image/png' | 'video/MP2T' | 'text/plain' | 'application/json' | 'video/quicktime'
  description: string
  ephemeral: boolean
}[]

export type Messages = {
  content: string
  fileAttachments: Attachments
  authorID: string
  authorName: string
  authorAvatar: string
  createdAtDate: Date
}

export type ThreadProps = {
  info: {
    name: string
    id: string
    guildId: string
    createdAt: Date
  }
  messageCount: number
  messages: Messages[]
}

export const RenderThread: React.FC<ThreadProps> = props => {
  const { info, messageCount, messages } = props

  const author = messages[0].authorName

  const selectedAuthorAvatar = `https://cdn.discordapp.com/avatars/${messages[0].authorID}/${messages[0].authorAvatar}.png?size=256`
  const defaultAuthorAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
  const authorAvatarImg = messages[0].authorAvatar ? selectedAuthorAvatar : defaultAuthorAvatar

  const originalMessage = messages[0].content

  const allMessagesExceptOriginal = messages.slice(1)

  const postUrl = `https://discord.com/channels/${info.guildId}/${info.id}`

  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={10} colsL={9} className={classes.post}>
            <DiscordGitIntro
              postUrl={postUrl}
              postName={info.name}
              author={author}
              image={authorAvatarImg}
              date={info.createdAt}
              platform="Discord"
              messageCount={messageCount}
              content={originalMessage}
            />
            <DiscordGitComments comments={allMessagesExceptOriginal} platform="Discord" />
            <OpenPost url={postUrl} platform="Discord" />
          </Cell>
        </Grid>
      </Gutter>
      <DiscordGitCTA />
    </HeaderObserver>
  )
}

export default RenderThread
