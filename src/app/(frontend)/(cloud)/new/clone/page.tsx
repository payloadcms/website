import type { Metadata } from 'next'

import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchTemplates } from '@cloud/_api/fetchTemplates'
import { Gutter } from '@components/Gutter/index'
import { NewProjectBlock } from '@components/NewProject/index'
import { RenderParams } from '@components/RenderParams/index'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { redirect } from 'next/navigation'
import React, { Fragment } from 'react'

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
  openGraph: mergeOpenGraph({
    title: 'Clone Template | Payload Cloud',
    url: '/new/clone',
  }),
  title: 'Clone Template | Payload Cloud',
}
