'use client'

import React from 'react'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { Gutter } from '@components/Gutter'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import AuthorTag from '@components/AuthorTag'
import DiscordGitCTA from '@components/DiscordGitCTA'

import classes from './index.module.scss'

// TODO: implement images into message content
// TODO: add all CTAS
// TODO: add in URLs to AuthorTag comp
// TODO: style for mobile

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

export type ThreadProps = {
  info: {
    name: string
    id: string
    createdAt: Date
  }
  messageCount: number
  messages: {
    content: string
    fileAttachments: Attachments
    authorID: string
    authorName: string
    authorAvatar: string
    createdAtDate: Date
  }[]
}

export const RenderThread: React.FC<ThreadProps> = props => {
  const { info, messageCount, messages } = props

  const author = messages[0].authorName

  const selectedAuthorAvatar = `https://cdn.discordapp.com/avatars/${messages[0].authorID}/${messages[0].authorAvatar}.png?size=256`
  const defaultAuthorAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
  const authorAvatarImg = messages[0].authorAvatar ? selectedAuthorAvatar : defaultAuthorAvatar

  const originalMessage = messages[0].content

  const allMessagesExceptOriginal = messages.slice(1)

  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Breadcrumbs
          items={[
            {
              label: 'Community Help',
              url: '/community-help',
            },
            {
              label: 'Discord',
              url: '/community-help/discord',
            },
          ]}
        />
      </Gutter>
      <Gutter className={classes.threadWrap}>
        <div className={classes.thread}>
          <h1 className={classes.title}>{info.name}</h1>
          <div className={classes.originalAuthorInfo}>
            <AuthorTag
              author={author}
              image={authorAvatarImg}
              date={info.createdAt}
              url=""
              platform="Discord"
            />
            <div className={classes.comments}>
              <CommentsIcon /> {messageCount}
            </div>
          </div>
          <div className={classes.content} dangerouslySetInnerHTML={{ __html: originalMessage }} />
          <ul className={classes.messageWrap}>
            {messages &&
              allMessagesExceptOriginal.map((message, i) => {
                const selectedAvatar = `https://cdn.discordapp.com/avatars/${message.authorID}/${message.authorAvatar}.png?size=256`
                const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
                const avatarImg = message.authorAvatar ? selectedAvatar : defaultAvatar
                return (
                  <li className={classes.message} key={i}>
                    <AuthorTag
                      author={message.authorName}
                      image={avatarImg}
                      date={message.createdAtDate}
                      url=""
                      platform="Discord"
                      comment
                    />
                    <div
                      className={classes.content}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </li>
                )
              })}
          </ul>
        </div>
        <DiscordGitCTA />
      </Gutter>
    </HeaderObserver>
  )
}

export default RenderThread
