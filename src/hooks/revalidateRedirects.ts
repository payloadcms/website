import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook & CollectionAfterDeleteHook = ({
  doc,
  req: { payload },
}) => {
  payload.logger.info(`Revalidating redirects`)

  revalidateTag('redirects', { expire: 0 })

  return doc
}
