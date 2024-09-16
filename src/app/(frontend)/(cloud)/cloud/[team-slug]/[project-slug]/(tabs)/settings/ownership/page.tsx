import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ProjectOwnershipPage } from './page_client.js'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectOwnershipPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  return {
    title: 'Ownership',
    openGraph: mergeOpenGraph({
      title: 'Ownership',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/ownership`,
    }),
  }
}
