import { Fragment } from 'react'
import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken.js'
import { fetchInstalls } from '@cloud/_api/fetchInstalls.js'
import { fetchMe } from '@cloud/_api/fetchMe.js'
import { fetchTemplate } from '@cloud/_api/fetchTemplate.js'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Gutter } from '@components/Gutter/index.js'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { uuid as generateUUID } from '@root/utilities/uuid.js'
import { CloneTemplate } from './page_client.js'

const title = `Create new from template`

export default async ({ params: { 'template-slug': templateSlug } }) => {
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
      {<CloneTemplate template={template} installs={installs} user={user} uuid={uuid} />}
    </Fragment>
  )
}

export async function generateMetadata({ params: { template } }): Promise<Metadata> {
  return {
    title: 'Clone Template | Payload Cloud',
    openGraph: mergeOpenGraph({
      url: `/new/clone/${template}`,
    }),
  }
}
