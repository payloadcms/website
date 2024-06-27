import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { fetchMe } from '../_api/fetchMe.js'
import { fetchProjects } from '../_api/fetchProjects.js'
import { fetchTemplates } from '../_api/fetchTemplates.js'
import { CloudPage } from './page_client.js'

export default async () => {
  const { user } = await fetchMe()

  const projectsRes = await fetchProjects(
    user?.teams?.map(({ team }) => (team && typeof team === 'object' ? team.id : team || '')) || [],
  )

  const templates = await fetchTemplates()

  return <CloudPage initialState={projectsRes} templates={templates} user={user} />
}

export const metadata: Metadata = {
  title: 'Home | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Home | Payload Cloud',
    url: '/cloud',
  }),
}
