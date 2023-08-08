import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectBuildSettingsPage } from './page_client'

export default async function ProjectBuildSettingsPageWrapper({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectBuildSettingsPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Build Settings',
    openGraph: mergeOpenGraph({
      title: 'Build Settings',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/build-settings`,
    }),
  }
}
