'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import { useHits } from 'react-instantsearch-hooks-web'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import getRelativeDate from '@root/utilities/get-relative-date'
import { AlgoliaPagination } from '@root/adapters/AlgoliaPagination'
import { ArchiveSearchBar } from './ArchiveSearchBar'
import { AlgoliaProvider } from './AlgoliaProvider'

import classes from './index.module.scss'

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
                          <h5 className={classes.title}>{hit.name}</h5>
                          <span className={classes.author}>{hit.author} posted</span>
                          <span className={classes.date}>
                            &nbsp;{getRelativeDate(hit.createdAt)}
                          </span>
                          <span className={classes.platform}>&nbsp;in {hit.platform}</span>
                        </div>
                        <div className={classes.upvotes}>
                          {hit.upvotes && hit.upvotes > 0 && (
                            <span>
                              <ArrowIcon rotation={-45} /> {hit.upvotes}
                            </span>
                          )}
                          {hit.messageCount && hit.messageCount > 0 && (
                            <span>
                              <CommentsIcon /> {hit.messageCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
            <AlgoliaPagination />
          </Cell>
        </Grid>
      </Gutter>
      <DiscordGitCTA />
    </HeaderObserver>
  )
}

export const RenderCommunityHelp = () => {
  return (
    <AlgoliaProvider>
      <CommunityHelp />
    </AlgoliaProvider>
  )
}
