'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { Gutter } from '@components/Gutter'
import AuthorTag from '@components/AuthorTag'
import DiscordGitCTA from '@components/DiscordGitCTA'
import OpenPost from '@components/OpenPost'
import Link from 'next/link'

import { FileAttachment } from '../../../../components/FileAttachment'

import classes from './index.module.scss'

// TODO: add all CTAS
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
    guildId: string
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

  const postUrl = `https://discord.com/channels/${info.guildId}/${info.id}`

  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={10} colsL={9} className={classes.thread}>
            <div className={classes.breadcrumbWrap}>
              <Link className={classes.breadcrumb} href="/community-help">
                Community Help
              </Link>
            </div>
            <div>
              <a className={classes.title} href={postUrl} rel="noopener noreferrer" target="_blank">
                <h3>{info.name}</h3>
              </a>
              <div className={classes.authorDetails}>
                <AuthorTag
                  author={author}
                  image={authorAvatarImg}
                  date={info.createdAt}
                  platform="Discord"
                  messageCount={messageCount}
                />
              </div>

              <div
                className={classes.content}
                dangerouslySetInnerHTML={{ __html: originalMessage }}
              />

              <ul className={classes.messageWrap}>
                {messages &&
                  allMessagesExceptOriginal.map((message, i) => {
                    const selectedAvatar = `https://cdn.discordapp.com/avatars/${message.authorID}/${message.authorAvatar}.png?size=256`
                    const defaultAvatar = 'https://cdn.discordapp.com/embed/avatars/0.png'
                    const avatarImg = message.authorAvatar ? selectedAvatar : defaultAvatar

                    const hasFileAttachments =
                      message.fileAttachments &&
                      Array.isArray(message.fileAttachments) &&
                      message.fileAttachments.length > 0

                    return (
                      <li className={classes.message} key={i}>
                        <AuthorTag
                          author={message.authorName}
                          image={avatarImg}
                          date={message.createdAtDate}
                          platform="Discord"
                          comment
                        />
                        <div
                          className={classes.content}
                          dangerouslySetInnerHTML={{ __html: message.content }}
                        />
                        {hasFileAttachments && (
                          <div className={classes.attachmentWrap}>
                            {message.fileAttachments.map((fileAttachment, x) => {
                              return (
                                <FileAttachment
                                  key={x}
                                  url={fileAttachment?.url}
                                  name={fileAttachment.name}
                                />
                              )
                            })}
                          </div>
                        )}
                      </li>
                    )
                  })}
              </ul>

              <OpenPost url={postUrl} platform="Discord" />
            </div>
          </Cell>
        </Grid>
      </Gutter>
      <DiscordGitCTA />
    </HeaderObserver>
  )
}

export default RenderThread
