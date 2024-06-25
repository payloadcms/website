import { useId } from 'react'

import { formatDrawerSlug } from './index.js'

export const useDrawerSlug = (slug: string): string => {
  const uuid = useId()
  return formatDrawerSlug({
    slug: `${slug}-${uuid}`,
  })
}
