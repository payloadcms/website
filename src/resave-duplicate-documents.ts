import config from '@payload-config'
import { getPayload } from 'payload'

const resaveDuplicateDocuments = async () => {
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
      console.log(`Checking collection: ${collectionSlug} with ${results.totalDocs} documents`)

      // Find duplicate ids
      const idMap = new Map()
      results.docs.forEach(doc => {
        if (idMap.has(doc.id)) {
          idMap.set(doc.id, idMap.get(doc.id) + 1)
        } else {
          idMap.set(doc.id, 1)
        }
      })

      // Filter only the duplicate ids
      const duplicateIds = Array.from(idMap.entries())
        .filter(([id, count]) => count > 1)
        .map(([id]) => id)

      if (duplicateIds.length > 0) {

        // eslint-disable-next-line no-console
        console.log(`Found ${duplicateIds.length} duplicate IDs in '${collectionSlug}'. Resaving documents...`)

        await Promise.all(results.docs
          .filter(doc => duplicateIds.includes(doc.id))
          .map(async (result) => {
            const { id } = result

            try {
              await payload.update({
                id,
                collection: collectionSlug,
                data: {},
              })

              // eslint-disable-next-line no-console
              console.log(`Document in '${collectionSlug}' with duplicate id '${id}' updated successfully`)
            } catch (e) {
              payload.logger.error(`Document in '${collectionSlug}' with duplicate id '${id}' failed to update`)
              payload.logger.error(e)
            }
          })
        )
      } else {
        // eslint-disable-next-line no-console
        console.log(`No duplicate IDs found in '${collectionSlug}'`)
      }
    }
  } catch (e) {
    payload.logger.error('Something went wrong.')
    payload.logger.error(e)
  }

  // eslint-disable-next-line no-console
  console.log('Complete')
  process.exit(0)
}

void resaveDuplicateDocuments()