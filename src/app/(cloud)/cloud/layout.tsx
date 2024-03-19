import { Fragment } from 'react'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { RenderParams } from '../../_components/RenderParams'
import { fetchMe } from './_api/fetchMe'
import { DashboardBreadcrumbs } from './_components/DashboardBreadcrumbs'

export const metadata: Metadata = {
  title: {
    template: '%s | Payload Cloud',
    default: 'Payload Cloud',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload CMS',
    description: 'The Node & React TypeScript Headless CMS',
    creator: '@payloadcms',
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
