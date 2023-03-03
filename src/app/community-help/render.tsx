'use client'

import { Banner } from '@components/Banner'
import { Gutter } from '@components/Gutter'
import { HeaderObserver } from '@components/HeaderObserver'
import { useTheme } from '@root/providers/Theme'
import React from 'react'
import { DocSearch } from '@docsearch/react'
import {
  Configure,
  useCurrentRefinements,
  useHits,
  usePagination,
} from 'react-instantsearch-hooks-web'
import { ThreadProps } from './discord/[thread]/render'
import { DiscussionProps } from './github/[discussion]/render'

import classes from './index.module.scss'
import { ArchiveSearchBar } from './ArchiveFilterBar'
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

  console.log(hits)

  const hasResults = hits && Array.isArray(hits) && hits.length > 0

  return (
    <HeaderObserver color={theme} pullUp>
      <Gutter>
        <Banner type="error">
          This page is currently under construction &mdash; community help archive coming soon.
        </Banner>
        {/* <DocSearch
          appId="9MJY7K9GOW"
          indexName="payloadcms"
          apiKey={process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY}
        /> */}
        <ArchiveSearchBar />
        {hasResults && (
          <ul>
            {hits.map((hit, i) => {
              return <li key={i}>{hit.anchor}</li>
            })}
          </ul>
        )}

        {/* <div className={classes.wrap}>
          <div>
            <h2>GitHub</h2>
            <h6>Total: {discussions.length}</h6>
            <ul>
              {discussions.map((discussion, i) => {
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
            <h6>Total: {threads.length}</h6>
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
        </div> */}
      </Gutter>
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
