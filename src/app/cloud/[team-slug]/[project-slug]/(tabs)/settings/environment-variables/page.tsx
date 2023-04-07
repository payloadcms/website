import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectEnvPage } from './client_page'

export default props => {
  return <ProjectEnvPage {...props} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}) {
  return {
    title: 'Environment Variables',
    openGraph: mergeOpenGraph({
      url: `/cloud/${teamSlug}/${projectSlug}/settings/environment-variables`,
    }),
  }
}
