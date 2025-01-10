import type { Payload } from 'payload'

import { revalidate } from './revalidate'

export const revalidatePage = async ({
  collection,
  doc,
  payload,
}: {
  collection: string
  doc: any // eslint-disable-line @typescript-eslint/no-explicit-any
  payload: Payload
}): Promise<void> => {
  if (doc._status === 'published') {
    revalidate({ slug: doc.slug, collection, payload })
  }
}
