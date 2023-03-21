'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '@components/Gutter'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import { useHits } from 'react-instantsearch-hooks-web'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { GithubIcon } from '@root/graphics/GithubIcon'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import getRelativeDate from '@root/utilities/get-relative-date'
import { AlgoliaPagination } from '@root/adapters/AlgoliaPagination'
import Link from 'next/link'
import { ArchiveSearchBar } from './ArchiveSearchBar'
import { AlgoliaProvider } from './AlgoliaProvider'
import { Banner } from '@components/Banner'

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
                          <span className={classes.author}>
                            <strong>{author}</strong> posted
                          </span>
                          <span className={classes.date}>
                            <strong>&nbsp;{getRelativeDate(createdAt)}</strong>
                          </span>
                          <span className={classes.platform}>
                            &nbsp;in&nbsp;
                            {platform === 'Discord' && <DiscordIcon className={classes.icon} />}
                            {platform === 'Github' && <GithubIcon className={classes.icon} />}
                            {' '}{platform}
                          </span>
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
              <Banner type="warning">
                <h5>Sorry, no results were found...</h5>
                <label>Search tips</label>
                <ul>
                  <li>Make sure all words are spelled correctly</li>
                  <li>Try more general keywords</li>
                  <li>Try different keywords</li>
                </ul>
              </Banner>
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
