import type { Payload } from 'payload'

import { revalidate } from './revalidate'

export const revalidatePage = async ({
  doc,
  collection,
  payload,
}: {
  doc: any // eslint-disable-line @typescript-eslint/no-explicit-any
  collection: string
  payload: Payload
}): Promise<void> => {
  if (doc._status === 'published') {
    revalidate({ payload, collection, slug: doc.slug })
  }
}
