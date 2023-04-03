'use client'

import React from 'react'
import { useHits } from 'react-instantsearch-hooks-web'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { Banner } from '@components/Banner'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { AlgoliaPagination } from '@root/adapters/AlgoliaPagination'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { GithubIcon } from '@root/graphics/GithubIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { useTheme } from '@root/providers/Theme'
import getRelativeDate from '@root/utilities/get-relative-date'
import { AlgoliaProvider } from './AlgoliaProvider'
import { ArchiveSearchBar } from './ArchiveSearchBar'

import classes from './index.module.scss'

export const CommunityHelp: React.FC = () => {
  const theme = useTheme()

  const { hits }: { hits: Array<any> } = useHits()

  const hasResults = hits && Array.isArray(hits) && hits.length > 0
  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Grid>
          <Cell cols={10} colsL={9} className={classes.communityHelpWrap}>
            <h1>Community Help</h1>
            <ArchiveSearchBar className={classes.searchBar} />
            {hasResults && (
              <ul className={classes.postsWrap}>
                {hits.map((hit, i) => {
                  const { name, author, createdAt, platform, slug } = hit
                  return (
                    <li key={i} className={classes.post}>
                      <Link
                        className={classes.postContent}
                        href={`/community-help/${platform.toLowerCase()}/${slug}`}
                      >
                        <div>
                          <h5 className={classes.title}>{name}</h5>
                          <div className={classes.titleMeta}>
                            <span className={classes.platform}>
                              {platform === 'Discord' && <DiscordIcon className={classes.icon} />}
                              {platform === 'Github' && (
                                <GithubIcon className={classes.icon} />
                              )}{' '}
                            </span>
                            <span className={classes.author}>{author}</span>
                            <span>—</span>
                            <span className={classes.date}>&nbsp;{getRelativeDate(createdAt)}</span>
                          </div>
                        </div>
                        <div className={classes.upvotes}>
                          {hit.upvotes > 0 && (
                            <span>
                              <ArrowIcon rotation={-45} /> {hit.upvotes || ''}
                            </span>
                          )}
                          {hit.messageCount > 0 && (
                            <span>
                              <CommentsIcon /> {hit.messageCount}
                            </span>
                          )}
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            {!hasResults && (
              <>
                <h5>Sorry, no results were found...</h5>
                <Banner type="warning">
                  <label>Search tips</label>
                  <ul>
                    <li>Make sure all words are spelled correctly</li>
                    <li>Try more general keywords</li>
                    <li>Try different keywords</li>
                  </ul>
                </Banner>
              </>
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
