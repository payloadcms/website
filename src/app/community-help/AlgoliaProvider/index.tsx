import React, { useState } from 'react'
import algoliasearch, { SearchClient } from 'algoliasearch/lite'
import { Configure, InstantSearch } from 'react-instantsearch-hooks-web'
import { IndexUiState, UiState } from 'instantsearch.js'
import { history } from 'instantsearch.js/es/lib/routers'
import router from 'next/router'
import { getInitialState } from './getInitialState'

let searchClient: SearchClient
const appID = process.env.NEXT_PUBLIC_ALGOLIA_CH_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_CH_KEY
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_CH_INDEX_NAME
if (appID && apiKey) searchClient = algoliasearch(appID, apiKey)
export const algoliaPerPage = 20

export const AlgoliaProvider: React.FC<{
  children?: React.ReactNode
}> = props => {
  const { children } = props

  const [initialURLState] = useState<IndexUiState>(() => getInitialState())

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

              // router.push(href, undefined, { shallow: true })

              return href
            },
          }),
          stateMapping: {
            // @ts-ignore
            stateToRoute(uiState: UiState): IndexUiState {
              const indexUiState = uiState[indexName]
              if (indexUiState.configure) delete indexUiState.configure
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
