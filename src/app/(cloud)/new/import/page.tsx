import { Fragment } from 'react'
import { fetchGitHubToken } from '@cloud/_api/fetchGitHubToken'
import { fetchInstalls } from '@cloud/_api/fetchInstalls'
import { fetchMe } from '@cloud/_api/fetchMe'
import { fetchRepos, Repo, RepoResults } from '@cloud/_api/fetchRepos'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { uuid as generateUUID } from '@root/utilities/uuid'
import { ImportProject } from './page_client'

const title = `Import a codebase`

export default async () => {
  const { user } = await fetchMe()

  if (!user) {
    redirect(
      `/login?redirect=${encodeURIComponent('/new/import')}&warning=${encodeURIComponent(
        'You must first login to import a repository',
      )}`,
    )
  }

  const token = await fetchGitHubToken()

  if (!token) {
    redirect(`/new/authorize?redirect=${encodeURIComponent(`/new/import`)}`)
  }

  const installs = await fetchInstalls()

  let repos: RepoResults | undefined

  if (Array.isArray(installs) && installs.length > 0) {
    repos = await fetchRepos({
      install: installs[0],
    })
  }

  const uuid = generateUUID()

  return (
    <Fragment>
      <Gutter>
        <h2>{title}</h2>
      </Gutter>
      <ImportProject installs={installs} repos={repos} uuid={uuid} user={user} />
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
