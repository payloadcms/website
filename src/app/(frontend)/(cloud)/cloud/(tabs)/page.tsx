import type { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

import { fetchMe } from '../_api/fetchMe'
import { fetchProjects } from '../_api/fetchProjects'
import { fetchTemplates } from '../_api/fetchTemplates'
import { CloudPage } from './page_client'

export default async () => {
  const { user } = await fetchMe()

  const projectsRes = await fetchProjects(
    user?.teams?.map(({ team }) => (team && typeof team === 'object' ? team.id : team || '')) || [],
  )

  const templates = await fetchTemplates()

  return <CloudPage initialState={projectsRes} templates={templates} user={user} />
}

export const metadata: Metadata = {
  openGraph: mergeOpenGraph({
    title: 'Home | Payload Cloud',
    url: '/cloud',
  }),
  title: 'Home | Payload Cloud',
}
