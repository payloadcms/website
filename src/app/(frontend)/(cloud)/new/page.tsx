import React, { Fragment } from 'react'
import { fetchTemplates } from '@cloud/_api/fetchTemplates.js'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter/index.js'
import { NewProjectBlock } from '@components/NewProject/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { RenderParams } from '@components/RenderParams/index.js'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage({ searchParams: { team: teamSlug } }) {
  const templates = await fetchTemplates()

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      <NewProjectBlock templates={templates} teamSlug={teamSlug} />
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'New Project | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'New Project | Payload Cloud',
    url: '/new',
  }),
}
