// ensure that the home page is revalidated at '/' instead of '/home'
// Revalidate the page in the background, so the user doesn't have to wait
// Notice that the function itself is not async and we are not awaiting `revalidate`

import type { Payload } from 'payload'

export const revalidate = async (args: {
  collection: string
  payload: Payload
  slug: string
}): Promise<void> => {
  const { slug, collection, payload } = args

  try {
    const res = await fetch(
      `${process.env.PAYLOAD_PUBLIC_APP_URL}/api/revalidate?secret=${process.env.REVALIDATION_KEY}&collection=${collection}&slug=${slug}`,
    )

    if (res.ok) {
      payload.logger.info(`Revalidated page '${slug}' in collection '${collection}'`)
    } else {
      payload.logger.error(
        `Error revalidating page '${slug}' in collection '${collection}': ${res}`,
      )
    }
  } catch (err: unknown) {
    payload.logger.error(
      `Error hitting revalidate route for page '${slug}' in collection '${collection}': ${err}`,
    )
  }
}
