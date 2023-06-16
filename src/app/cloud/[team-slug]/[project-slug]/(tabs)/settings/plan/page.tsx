import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectPlanPage } from './client_page'

export default props => {
  return <ProjectPlanPage {...props} />
}

export async function generateMetadata({
  params: { 'team-slug': teamSlug, 'project-slug': projectSlug },
}): Promise<Metadata> {
  return {
    title: 'Plan',
    openGraph: mergeOpenGraph({
      title: 'Plan',
      url: `/cloud/${teamSlug}/${projectSlug}/settings/plan`,
    }),
  }
}
