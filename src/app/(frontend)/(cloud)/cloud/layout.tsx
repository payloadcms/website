import type { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { RenderParams } from '@components/RenderParams/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { Fragment } from 'react'

import { fetchMe } from './_api/fetchMe.js'

export const metadata: Metadata = {
  title: {
    default: 'Payload Cloud',
    template: '%s | Payload Cloud',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
    description: 'The Node & React TypeScript Headless CMS',
    title: 'Payload',
  },
  // TODO: Add cloud graphic
  openGraph: mergeOpenGraph(),
}

export default async props => {
  const { children } = props

  await fetchMe({
    nullUserRedirect: `/login?error=${encodeURIComponent(
      'You must be logged in to visit this page',
    )}`,
  })

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      {children}
    </Fragment>
  )
}
