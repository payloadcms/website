import React, { Fragment } from 'react'
import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { NewProjectBlock } from '@root/app/_components/NewProject'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { RenderParams } from '../../_components/RenderParams'

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
