import React, { useState } from 'react'
import algoliasearch, { SearchClient } from 'algoliasearch/lite'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { IndexUiState, UiState } from 'instantsearch.js'
import { history } from 'instantsearch.js/es/lib/routers'
import Router from 'next/router'
import { getInitialState } from './getInitialState'

// https://www.algolia.com/doc/guides/building-search-ui/going-further/routing-urls/react-hooks/

let searchClient: SearchClient
const appID = '9MJY7K9GOW'
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_DOCSEARCH_KEY || ''
if (appID && apiKey) searchClient = algoliasearch(appID, apiKey)

export const algoliaPerPage = 20

export const AlgoliaProvider: React.FC<{
  children?: React.ReactNode
  indexName?: string
}> = props => {
  const { children, indexName = 'searchable_posts_date_desc' } = props

  const [initialURLState] = useState<IndexUiState>(() => getInitialState())

  const [algoliaIndex] = useState<string | undefined>(() => {
    if (indexName) {
      return `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PREFIX}${indexName}`
    }
  })

  if (indexName) {
    return (
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        initialUiState={{
          [indexName]: {
            configure: {
              hitsPerPage: algoliaPerPage,
              facetingAfterDistinct: true,
            },
            ...initialURLState,
          },
        }}
        routing={{
          router: history({
            parseURL({ qsModule, location }) {
              const search = location.search.slice(1)
              const parsedSearch = qsModule.parse(search) as UiState
              return parsedSearch
            },
            createURL({ qsModule, location, routeState }) {
              const { origin, pathname, hash } = location
              const queryString = qsModule.stringify(routeState, {
                encode: true,
                arrayFormat: 'repeat',
                addQueryPrefix: true,
              })

              const encodedString = queryString // try and keep a human-friendly url, decode brackets
                .replace(/%5B/g, '[')
                .replace(/%5D/g, ']')

              const href = `${origin}${pathname}${encodedString}${hash}`

              Router.push(href, undefined, { shallow: true })

              return href
            },
          }),
          stateMapping: {
            // @ts-ignore
            stateToRoute(uiState: UiState): IndexUiState {
              const indexUiState = uiState[algoliaIndex]
              delete indexUiState.configure
              return indexUiState
            },
            // @ts-ignore
            routeToState(routeState: IndexUiState): IndexUiState {
              return routeState
            },
          },
        }}
      >
        <Configure hitsPerPage={algoliaPerPage} facetingAfterDistinct />
        {children && children}
      </InstantSearch>
    )
  }

  return null
}
