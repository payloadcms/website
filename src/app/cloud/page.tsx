import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { fetchMe } from './_api/fetchMe'
import { fetchProjects } from './_api/fetchProjects'
import { CloudPage } from './page_client'

export default async function CloudPageWrapper() {
  const { user } = await fetchMe()
  const projectsRes = await fetchProjects()
  return <CloudPage initialState={projectsRes} user={user} />
}

export const metadata: Metadata = {
  title: 'Home | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Home | Payload Cloud',
    url: '/cloud',
  }),
}
