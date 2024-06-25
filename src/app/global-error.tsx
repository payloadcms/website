'use client'

import * as Sentry from '@sentry/nextjs'
import NextErrorImport from 'next/error.js'
const NextError = 'default' in NextErrorImport ? NextErrorImport.default : NextErrorImport

import { useEffect } from 'react'

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
