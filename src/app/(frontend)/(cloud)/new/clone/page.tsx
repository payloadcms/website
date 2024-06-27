import React, { Fragment } from 'react'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchTemplates } from '@cloud/_api/fetchTemplates.js'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Gutter } from '@components/Gutter/index.js'
import { NewProjectBlock } from '@components/NewProject/index.js'
import { RenderParams } from '@components/RenderParams/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'

export default async () => {
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent('/new/clone')}&warning=${encodeURIComponent(
        'You must first login to clone a template',
      )}`,
    )
  }

  const templates = await fetchTemplates()

  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      <NewProjectBlock templates={templates} />
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
