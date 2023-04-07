import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectBuildSettingsPage } from './client_page'

export default props => {
  return <ProjectBuildSettingsPage {...props} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Build Settings',
    openGraph: mergeOpenGraph({
      url: `/cloud/${teamSlug}/${projectSlug}/settings/build-settings`,
    }),
  }
}
