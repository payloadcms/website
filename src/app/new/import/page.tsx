import { Fragment } from 'react'
import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { fetchRepos } from '@cloud/_api/fetchRepos'
import { fetchToken } from '@cloud/_api/fetchGitHubToken'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ImportProject } from './ImportProject'

const title = `Import a codebase`

export default async function ProjectFromImportPage() {
  const token = await fetchToken()

  if (!token) {
    redirect(`/new/authorize?redirect=${encodeURIComponent(`/new/import`)}`)
  }

  const installs = await fetchInstalls()

  const repos = await fetchRepos({
    install: installs[0],
  })

  return (
    <Fragment>
      <Gutter>
        <div>
          <Breadcrumbs
            items={[
              {
                label: 'New',
                url: '/new',
              },
              {
                label: 'Import',
              },
            ]}
          />
          <Heading marginTop={false} element="h1">
            {title}
          </Heading>
        </div>
      </Gutter>
      <ImportProject installs={installs} repos={repos} />
    </Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Import Project | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Import Project | Payload Cloud',
    url: '/new/import',
  }),
}
