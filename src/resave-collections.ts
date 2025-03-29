import config from '@payload-config'
import { getPayload } from 'payload'

const resaveCollections = async () => {
  const payload = await getPayload({ config })

  type CollectionSlug = 'case-studies' | 'community-help' | 'docs' | 'media' | 'pages' | 'partners' | 'posts' | 'reusable-content' | 'users';

  const collectionSlugs: CollectionSlug[] = [
    'community-help',
    'case-studies',
    'docs',
    'media',
    'pages',
    'partners',
    'posts',
    'reusable-content',
    'users'
  ]

  try {
    // Loop through each collection
    for (const collectionSlug of collectionSlugs) {
      const results = await payload.find({
        collection: collectionSlug,
        depth: 0,
      })

      // eslint-disable-next-line no-console
      console.log(`Resaving collection: ${collectionSlug} with ${results.totalDocs} documents`)

      await Promise.all(results.docs.map(async (result) => {
        const { id } = result

        try {
          await payload.update({
            id,
            collection: collectionSlug,
            data: {},
          })

          // eslint-disable-next-line no-console
          console.log(`Document in '${collectionSlug}' with id '${id}' updated successfully`)
        } catch (e) {
          payload.logger.error(`Document in '${collectionSlug}' with id '${id}' failed to update`)
          payload.logger.error(e)
        }
      }))
    }
  } catch (e) {
    payload.logger.error('Something went wrong.')
    payload.logger.error(e)
  }

  // eslint-disable-next-line no-console
  console.log('Complete')
  process.exit(0)
}

void resaveCollections()