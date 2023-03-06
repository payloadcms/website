'use client'

import React from 'react'

import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import { ThreadProps } from './discord/[thread]/render'
import { DiscussionProps } from './github/[discussion]/render'

import classes from './index.module.scss'

export const RenderCommunityHelp: React.FC<{
  discussions?: DiscussionProps[]
  threads?: ThreadProps[]
}> = ({ discussions, threads }) => {
  const theme = useTheme()

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Banner type="error">
          This page is currently under construction &mdash; community help archive coming soon.
        </Banner>
        <div className={classes.wrap}>
          <div>
            <h2>GitHub</h2>
            <h6>Total: {discussions?.length}</h6>
            <ul>
              {discussions?.map((discussion, i) => {
                return (
                  <li key={i}>
                    <a
                      href={`/community-help/github/${discussion.id}`}
                      aria-label={discussion.title}
                    >
                      {discussion.title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h2>Discord</h2>
            <h6>Total: {threads?.length}</h6>
            <ul>
              {threads?.map((thread, i) => {
                return (
                  <li key={i}>
                    <a
                      href={`/community-help/discord/${thread.info.id}`}
                      aria-label={thread.info.name}
                    >
                      {thread.info.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </Gutter>
    </HeaderObserver>
  )
}
