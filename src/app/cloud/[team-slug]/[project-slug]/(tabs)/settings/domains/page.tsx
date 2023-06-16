import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectDomainsPage } from './client_page'

export default props => {
  return <ProjectDomainsPage {...props} />
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
