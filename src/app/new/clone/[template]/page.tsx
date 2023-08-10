import { Fragment } from 'react'
import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { fetchTemplate } from '@cloud/_api/fetchTemplate'
import { fetchToken } from '@cloud/_api/fetchGitHubToken'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { CloneTemplate } from './CloneTemplate'

const title = `Create new from template`

export default async function ProjectFromTemplatePage({ params: { template: templateSlug } }) {
  const template = await fetchTemplate(templateSlug)

  if (!template) {
    redirect(`/new/clone?message=${encodeURIComponent('Template not found')}`)
  }

  const token = await fetchToken()

  if (!token) {
    redirect(`/new/authorize?redirect=${encodeURIComponent(`/new/clone/${templateSlug}`)}`)
  }

  const installs = await fetchInstalls()

  return (
    <Fragment>
      <Gutter>
        <Breadcrumbs
          items={[
            {
              label: 'New',
              url: '/new',
            },
            {
              label: 'Clone',
              url: '/new/clone',
            },
            {
              label: template?.name,
            },
          ]}
        />
        <Heading marginTop={false} element="h1">
          {title}
        </Heading>
      </Gutter>
      {<CloneTemplate template={template} installs={installs} />}
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
