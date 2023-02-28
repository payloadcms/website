'use client'

import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import React from 'react'

import classes from './index.module.scss'

export const RenderCommunityHelp: React.FC<{ discussions: any; threads: any }> = ({
  discussions,
  threads,
}) => {
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
            <ul>
              {discussions.map((discussion, i) => {
                return (
                  <li key={i}>
                    <a
                      href={`/community-help/github/${discussion.id}`}
                      aria-label={discussion.title}
                    >
                      {discussion.title}
                      {i}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          <div>
            <h2>Discord</h2>
            <ul>
              {threads.map((thread, i) => {
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
