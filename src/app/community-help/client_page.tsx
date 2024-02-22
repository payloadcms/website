'use client'

import React from 'react'
import { useInstantSearch } from 'react-instantsearch-hooks-web'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Banner } from '@components/Banner'
import DiscordGitCTA from '@components/DiscordGitCTA'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { AlgoliaPagination } from '@root/adapters/AlgoliaPagination'
import { CommentsIcon } from '@root/graphics/CommentsIcon'
import { DiscordIcon } from '@root/graphics/DiscordIcon'
import { GithubIcon } from '@root/graphics/GithubIcon'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import getRelativeDate from '@root/utilities/get-relative-date'
import { AlgoliaProvider } from './AlgoliaProvider'
import { ArchiveSearchBar } from './ArchiveSearchBar'

import classes from './index.module.scss'

export const CommunityHelp: React.FC = () => {
  const { results } = useInstantSearch()

  const hasResults = results.hits && Array.isArray(results.hits) && results.hits.length > 0

  const hasQuery = results.query && results.query.length > 0

  return (
    <div className={classes.communityHelpWrap}>
      <BackgroundGrid />
      <Gutter>
        <div className={['grid', classes.grid].join(' ')}>
          <div className={'start-1 cols-12'}>
            <Heading className={classes.heading} element="h1">
              Community Help
            </Heading>
            <div className={classes.searchBarWrap}>
              <ArchiveSearchBar className={classes.searchBar} />
            </div>
            {hasResults && (
              <ul className={classes.postsWrap}>
                {hasResults &&
                  results.hits.map((hit, i) => {
                    const { name, author, createdAt, platform, slug } = hit
                    return (
                      <li key={i} className={classes.post}>
                        <Link
                          className={classes.postContent}
                          href={`/community-help/${platform.toLowerCase()}/${slug}`}
                          style={{ textDecoration: 'none' }}
                          prefetch={false}
                        >
                          <div>
                            <h5 className={classes.title}>{name}</h5>
                            <div className={classes.titleMeta}>
                              <span className={classes.platform}>
                                {platform === 'Discord' && <DiscordIcon className={classes.icon} />}
                                {platform === 'Github' && <GithubIcon className={classes.icon} />}
                              </span>
                              <span className={classes.author}>{author}</span>
                              <span>—</span>
                              <span className={classes.date}>
                                &nbsp;{getRelativeDate(createdAt)}
                              </span>
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
            {!hasResults && hasQuery && (
              <>
                <Banner type="warning">
                  <h5>Sorry, no results were found...</h5>
                  <label>Search tips</label>
                  <ul>
                    <li>Make sure all words are spelled correctly</li>
                    <li>Try more general keywords</li>
                    <li>Try different keywords</li>
                  </ul>
                </Banner>
              </>
            )}
            {hasResults && <AlgoliaPagination className={classes.pagination} />}
          </div>
          <div className={['start-13 cols-4', classes.ctaWrap].join(' ')}>
            <DiscordGitCTA style="default" />
          </div>
        </div>
      </Gutter>
    </div>
  )
}

export const CommunityHelpPage = () => {
  return (
    <AlgoliaProvider>
      <CommunityHelp />
    </AlgoliaProvider>
  )
}
