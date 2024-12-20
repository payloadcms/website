import type { Metadata } from 'next'

import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken.js'
import { fetchInstalls } from '@cloud/_api/fetchInstalls.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchTemplate } from '@cloud/_api/fetchTemplate.js'
import { Gutter } from '@components/Gutter/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { uuid as generateUUID } from '@root/utilities/uuid.js'
import { redirect } from 'next/navigation'
import { Fragment } from 'react'

import { CloneTemplate } from './page_client.js'

const title = `Create new from template`

export default async ({
  params,
}: {
  params: Promise<{
    'template-slug': string
  }>
}) => {
  const { 'template-slug': templateSlug } = await params
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent(
        `/new/clone/${templateSlug}`,
      )}&warning=${encodeURIComponent('You must first log in to clone this template')}`,
    )
  }

  const token = await fetchGitHubToken()

  if (!token) {
    redirect(`/new/authorize?redirect=${encodeURIComponent(`/new/clone/${templateSlug}`)}`)
  }

  const template = await fetchTemplate(templateSlug)

  if (!template) {
    redirect(`/new/clone?message=${encodeURIComponent('Template not found')}`)
  }

  const installs = await fetchInstalls()

  const uuid = generateUUID()

  return (
    <Fragment>
      <Gutter>
        <h2>{title}</h2>
      </Gutter>
      {<CloneTemplate installs={installs} template={template} user={user} uuid={uuid} />}
    </Fragment>
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    template: string
  }>
}): Promise<Metadata> {
  const { template } = await params
  return {
    openGraph: mergeOpenGraph({
      url: `/new/clone/${template}`,
    }),
    title: 'Clone Template | Payload Cloud',
  }
}
