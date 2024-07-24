'use client'
import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'

import { useEffect } from 'react'

import { Gutter } from '@components/Gutter/index.js'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error) // eslint-disable-line no-console
    Sentry.captureException(error)
  }, [error])

  return (
    <Gutter>
      <h2>Something went wrong</h2>
      <NextError statusCode={0} />
    </Gutter>
  )
}
