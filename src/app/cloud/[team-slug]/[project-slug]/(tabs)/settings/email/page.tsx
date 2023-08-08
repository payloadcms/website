import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectEmailPage } from './page_client'

export default async function ProjectEmailPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectEmailPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  return {
    title: 'Email',
    openGraph: mergeOpenGraph({
      url: `/cloud/${teamSlug}/${projectSlug}/settings/email`,
    }),
  }
}
