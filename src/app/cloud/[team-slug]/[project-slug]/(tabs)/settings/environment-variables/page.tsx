import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectEnvPage } from './page_client'

export default async function ProjectEnvPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectEnvPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  return {
    title: 'Environment Variables',
    openGraph: mergeOpenGraph({
      title: 'Environment Variables',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/environment-variables`,
    }),
  }
}
