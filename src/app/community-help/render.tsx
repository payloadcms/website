'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import {
  Configure,
  useCurrentRefinements,
  useHits,
  usePagination,
} from 'react-instantsearch-hooks-web'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { ThreadProps } from './discord/[thread]/render'
import { DiscussionProps } from './github/[discussion]/render'

import classes from './index.module.scss'
import { ArchiveSearchBar } from './ArchiveSearchBar'
import { AlgoliaProvider } from './AlgoliaProvider'

export type CommunityHelpType = {
  discussions: DiscussionProps[]
  threads: ThreadProps[]
}

export const CommunityHelp: React.FC<
  CommunityHelpType & {
    indexName: string
  }
> = ({ discussions, threads }) => {
  const theme = useTheme()

  const { hits }: { hits: Array<any> } = useHits()

  const hasResults = hits && Array.isArray(hits) && hits.length > 0

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={10} colsL={9} className={classes.communityHelpWrap}>
            <Banner type="error">
              This page is currently under construction &mdash; community help archive coming soon.
            </Banner>
            <ArchiveSearchBar className={classes.searchBar} />
            {hasResults && (
              <ul className={classes.postsWrap}>
                {hits.map((hit, i) => {
                  return (
                    <li key={i} className={classes.post}>
                      <div className={classes.postContent}>
                        <div>
                          <h5 className={classes.title}>{hit.anchor}</h5>
                          <span className={classes.author}>Lorem Ipsum</span>
                          <span className={classes.date}>&nbsp;last week</span>
                          <span className={classes.platform}>&nbsp;in Discord</span>
                        </div>
                        <div className={classes.upvotes}>
                          <span>
                            <ArrowIcon rotation={-45} /> 4
                          </span>
                          <span>
                            <CommentsIcon /> 7
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </Cell>
        </Grid>
      </Gutter>
      <DiscordGitCTA />
    </HeaderObserver>
  )
}

export const RenderCommunityHelp = (props: CommunityHelpType) => {
  const indexName = 'payloadcms'

  return (
    <AlgoliaProvider indexName={indexName}>
      <CommunityHelp {...props} indexName={indexName} />
    </AlgoliaProvider>
  )
}
