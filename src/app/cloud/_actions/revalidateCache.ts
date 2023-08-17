'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

// this will invalidate the Next.js `Client-Side Router Cache`
// according to their docs, this is only possible using `Server Actions`
// https://nextjs.org/docs/app/building-your-application/caching#router-cache
// https://nextjs.org/docs/app/building-your-application/caching#invalidation-1
export async function revalidateCache(args: { tag?: string; path?: string }): Promise<void> {
  const { tag, path } = args

  if (!path && !tag) throw new Error('No path or tag provided')

  try {
    if (tag) {
      revalidateTag(tag)
    }

    if (path) {
      revalidatePath(path)
    }
  } catch (error: unknown) {
    console.error(error) // eslint-disable-line no-console
  }

  return
}
