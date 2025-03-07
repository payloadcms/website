'use client'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { DiscordGitComments } from '@components/DiscordGitComments/index'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index'
import { DiscordGitIntro } from '@components/DiscordGitIntro/index'
import { Gutter } from '@components/Gutter/index'
import OpenPost from '@components/OpenPost/index'
import * as cheerio from 'cheerio'
import React from 'react'

import classes from './index.module.scss'

export type Attachments = {
  attachment: string
  contentType:
    | 'application/json'
    | 'image/jpeg'
    | 'image/png'
    | 'text/plain'
    | 'video/MP2T'
    | 'video/quicktime'
  description: string
  ephemeral: boolean
  height: number
  name: string
  proxyURL: string
  size: number
  url: string
  width: number
}[]

export type Messages = {
  authorAvatar: string
  authorID: string
  authorName: string
  content: string
  createdAtDate: number | string
  fileAttachments: Attachments
}

export type ThreadProps = {
  communityHelpJSON: {
    info: {
      createdAt: number | string
      guildId: string
      id: string
      name: string
    }
    intro: Messages
    messageCount: number
    messages: Messages[]
    slug: string
  }
  communityHelpType?: 'discord' | 'github'
  discordID?: string
  githubID?: string
  id: string
  slug?: string
  title?: string
}
export const DiscordThreadPage: React.FC<ThreadProps> = (props) => {
  const { communityHelpJSON } = props

  const { info, intro, messageCount, messages } = communityHelpJSON

  const author = intro.authorName

  const selectedAuthorAvatar = `https://cdn.discordapp.com/avatars/${intro.authorID}/${intro.authorAvatar}.png?size=48`
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

  return (
    <div className={classes.wrap}>
      <BackgroundGrid className={classes.bg} />
      <Gutter>
        <div className={['grid', classes.grid].join(' ')}>
          <div className={['start-1 cols-12 ', classes.post].join('')}>
            <DiscordGitIntro
              attachments={intro.fileAttachments}
              author={author}
              content={wrappedOriginalMessage}
              date={info.createdAt}
              image={authorAvatarImg}
              messageCount={messageCount}
              platform="Discord"
              postName={info.name}
            />
            <DiscordGitComments comments={messages} platform="Discord" />
            <div className={classes.openPostWrap}>
              <OpenPost platform="Discord" url={postUrl} />
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
