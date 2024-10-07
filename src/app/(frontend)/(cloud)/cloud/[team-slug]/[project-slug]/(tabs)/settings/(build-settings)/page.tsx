import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ProjectBuildSettingsPage } from './page_client.js'

export default async ({
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
  }>
}) => {
  const { 'team-slug': teamSlug, 'project-slug': projectSlug } = await params
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectBuildSettingsPage project={project} team={team} />
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    'team-slug': string
    'project-slug': string
  }>
}): Promise<Metadata> {
  const { 'team-slug': teamSlug, 'project-slug': projectSlug } = await params
  return {
    title: 'Build Settings',
    openGraph: mergeOpenGraph({
      title: 'Build Settings',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/build-settings`,
    }),
  }
}
