import { fetchProjectAndRedirect } from '@root/app/(cloud)/cloud/_api/fetchProject'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectDomainsPage } from './page_client'

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
