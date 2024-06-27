import React, { useState } from 'react'
import { Configure, InstantSearch } from 'react-instantsearch'
import algoliasearch, { SearchClient } from 'algoliasearch/lite.js'

import { getInitialState } from './getInitialState.js'

let searchClient: SearchClient
const appID = process.env.NEXT_PUBLIC_ALGOLIA_CH_ID
const apiKey = process.env.NEXT_PUBLIC_ALGOLIA_PUBLIC_KEY
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_CH_INDEX_NAME
// @ts-ignore
if (appID && apiKey) searchClient = algoliasearch(appID, apiKey)
export const algoliaPerPage = 20

export const AlgoliaProvider: React.FC<{
  children?: React.ReactNode
}> = props => {
  const { children } = props

  const [initialURLState] = useState(() => getInitialState())

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
              facetFilters: [['helpful:true']],
              ...initialURLState,
            },
          },
        }}
      >
        <Configure
          hitsPerPage={algoliaPerPage}
          facetingAfterDistinct
          facetFilters={['helpful:true']}
        />
        {children && children}
      </InstantSearch>
    )
  }

  return null
}
