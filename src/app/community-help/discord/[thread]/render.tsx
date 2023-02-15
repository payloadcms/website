'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@providers/Theme'
import { Gutter } from '@components/Gutter'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import AuthorTag from '@components/AuthorTag'
import { getSpecificDateTime } from '@root/utilities/get-specific-date-time'

import classes from './index.module.scss'

export type ThreadProps = {
  info: {
    name: string
    id: string
    createdAt: Date
  }
  messageCount: number
  messages: {
    content: string
    authorID: string
    authorName: string
    authorAvatar: string
    createdAtDate: Date
  }[]
}

export const RenderThread: React.FC<ThreadProps> = props => {
  const { info, messageCount, messages } = props

  const author = messages[0].authorName
  const authorAvatarImg = `https://cdn.discordapp.com/avatars/${messages[0].authorID}/${messages[0].authorAvatar}.png?size=256`
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
      <Gutter>
        <Grid>
          <Cell start={1} cols={9} colsL={8} colsM={5} colsS={12}>
            <h1 className={classes.title}>{info.name}</h1>
            <div className={classes.authorInfo}>
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
            <div
              className={classes.content}
              dangerouslySetInnerHTML={{ __html: originalMessage }}
            />
            <ul className={classes.messageWrap}>
              {messages &&
                allMessagesExceptOriginal.map((message, i) => {
                  const avatarImg = `https://cdn.discordapp.com/avatars/${message.authorID}/${message.authorAvatar}.png?size=256`
                  const messageDate = getSpecificDateTime(message.createdAtDate)
                  return (
                    <li className={classes.message} key={i}>
                      <div className={classes.details}>
                        <div className={classes.authorDate}>
                          <a className={classes.author}>
                            <img src={avatarImg} />
                            <span>{message.authorName}</span>
                          </a>
                          <div className={classes.date}>{messageDate}</div>
                        </div>
                      </div>
                      <div
                        className={classes.content}
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </li>
                  )
                })}
            </ul>
          </Cell>
        </Grid>
      </Gutter>
    </HeaderObserver>
  )
}

export default RenderThread
