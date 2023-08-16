import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Metadata } from 'next'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })

  return null
}

export const metadata: Metadata = {
  title: 'Overview',
}
