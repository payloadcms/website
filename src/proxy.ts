/* eslint-disable no-console */
import type { NextFetchEvent, NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { trackDocumentationRequest } from './utilities/docsAnalytics'

export function proxy(request: NextRequest, event: NextFetchEvent): NextResponse {
  const isPrefetch =
    request.headers.has('next-router-prefetch') ||
    request.headers.get('purpose') === 'prefetch' ||
    request.headers.has('rsc')

  if (request.method === 'GET' && !isPrefetch) {
    event.waitUntil(
      trackDocumentationRequest(request).catch((error: unknown) => {
        console.error('Unable to track documentation request', error)
      }),
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    {
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'next-router-segment-prefetch' },
        { type: 'header', key: 'next-router-state-tree' },
        { type: 'header', key: 'rsc' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'query', key: '_rsc' },
      ],
      source: '/llms.txt',
    },
    {
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'next-router-segment-prefetch' },
        { type: 'header', key: 'next-router-state-tree' },
        { type: 'header', key: 'rsc' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'query', key: '_rsc' },
      ],
      source: '/llms-full.txt',
    },
    {
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'next-router-segment-prefetch' },
        { type: 'header', key: 'next-router-state-tree' },
        { type: 'header', key: 'rsc' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'query', key: '_rsc' },
      ],
      source: '/docs/:path*',
    },
  ],
}
