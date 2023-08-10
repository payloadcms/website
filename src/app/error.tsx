'use client'

import { useEffect } from 'react'

import { Gutter } from '@components/Gutter'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error) // eslint-disable-line no-console
  }, [error])

  return (
    <Gutter>
      <h2>Something went wrong</h2>
    </Gutter>
  )
}
