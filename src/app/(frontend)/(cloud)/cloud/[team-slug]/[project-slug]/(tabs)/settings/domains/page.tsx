import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject.js'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'
import { ProjectDomainsPage } from './page_client.js'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectDomainsPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  return {
    title: 'Domains',
    openGraph: mergeOpenGraph({
      title: 'Domains',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/domains`,
    }),
  }
}
