'use server'

import { revalidatePath, revalidateTag } from 'next/cache'

// this will invalidate the Next.js `Client-Side Router Cache`
// this type of cache is store during the user's session for client-side navigation
// this means that Server Components are not rebuilt when navigating between pages
// according to their docs, it is possible to purge this using a `Server Action`
// https://nextjs.org/docs/app/building-your-application/caching#router-cache
// https://nextjs.org/docs/app/building-your-application/caching#invalidation-1
export async function revalidateCache(args: { path?: string; tag?: string }): Promise<void> {
  const { path, tag } = args

  if (!path && !tag) {
    throw new Error('No path or tag provided')
  }

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
