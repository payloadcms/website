import { fetchProjectAndRedirect } from '@cloud/_api/fetchProject'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectBillingPage } from './page_client'

export default async ({ params: { 'team-slug': teamSlug, 'project-slug': projectSlug } }) => {
  const { team, project } = await fetchProjectAndRedirect({ teamSlug, projectSlug })
  return <ProjectBillingPage project={project} team={team} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Billing',
    openGraph: mergeOpenGraph({
      title: 'Billing',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/billing`,
    }),
  }
}
