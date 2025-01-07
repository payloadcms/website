import algoliasearch from 'algoliasearch'

const appID = process.env.NEXT_PUBLIC_ALGOLIA_CH_ID || ''
const apiKey = process.env.NEXT_PRIVATE_ALGOLIA_API_KEY || ''
const indexName = process.env.NEXT_PUBLIC_ALGOLIA_CH_INDEX_NAME || ''

const client = algoliasearch(appID, apiKey)

const index = client.initIndex(indexName)

// Keeps helpful flags in sync with Algolia
export const updateAlgolia = async (id: string, helpful: boolean): Promise<void> => {
  await index
    .partialUpdateObject(
      {
        helpful,
        objectID: id,
      },
      {
        createIfNotExists: false,
      },
    )
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Updated objectID ' + id + ' in Algolia')
    })
}
