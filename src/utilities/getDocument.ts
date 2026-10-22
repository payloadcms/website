import type { Config } from '@types'

import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

type Collection = keyof Config['collections']

async function getDocumentByID(collection: Collection, id: string) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth: 2,
    limit: 1,
    where: {
      id: {
        equals: id,
      },
    },
  })

  return page.docs[0]
}

/**
 * Resolve relationship IDs with enough depth to populate a post's category.
 */
export const getCachedDocumentByID = (collection: Collection, id: string) =>
  unstable_cache(async () => getDocumentByID(collection, id), [collection, 'id', id], {
    tags: [`${collection}_${id}`],
  })
