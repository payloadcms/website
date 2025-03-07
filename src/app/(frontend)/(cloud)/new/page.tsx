import type { Metadata } from 'next'

import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Gutter } from '@components/Gutter/index'
import { NewProjectBlock } from '@components/NewProject/index'
import { RenderParams } from '@components/RenderParams/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import React, { Fragment } from 'react'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{
    team: string
  }>
}) {
  const { team: teamSlug } = await searchParams
  const templates = await fetchTemplates()

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      <NewProjectBlock teamSlug={teamSlug} templates={templates} />
    </Fragment>
  )
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: 'New Project | Payload Cloud',
    url: '/new',
  }),
  title: 'New Project | Payload Cloud',
}
