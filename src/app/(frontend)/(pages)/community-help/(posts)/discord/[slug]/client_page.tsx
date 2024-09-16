'use client'

import React from 'react'
import * as cheerio from 'cheerio'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { DiscordGitComments } from '@components/DiscordGitComments/index.js'
import { DiscordGitCTA } from '@components/DiscordGitCTA/index.js'
import { DiscordGitIntro } from '@components/DiscordGitIntro/index.js'
import { Gutter } from '@components/Gutter/index.js'
import OpenPost from '@components/OpenPost/index.js'

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
  id: string
  title?: string
  slug?: string
  discordID?: string
  githubID?: string
  communityHelpType?: 'discord' | 'github'
  communityHelpJSON: {
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
}
export const DiscordThreadPage: React.FC<ThreadProps> = props => {
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
              postName={info.name}
              author={author}
              image={authorAvatarImg}
              date={info.createdAt}
              messageCount={messageCount}
              content={wrappedOriginalMessage}
              attachments={intro.fileAttachments}
              platform="Discord"
            />
            <DiscordGitComments comments={messages} platform="Discord" />
            <div className={classes.openPostWrap}>
              <OpenPost url={postUrl} platform="Discord" />
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
