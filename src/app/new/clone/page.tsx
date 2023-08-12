import React, { Fragment } from 'react'
import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { NewProjectBlock } from '@root/app/_components/NewProject'
import { RenderParams } from '@root/app/_components/RenderParams'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

export default async function ProjectFromTemplate() {
  const templates = await fetchTemplates()

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      <NewProjectBlock headingElement="h1" templates={templates} />
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Clone Template | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Clone Template | Payload Cloud',
    url: '/new/clone',
  }),
}
