import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'

import { default as EnvironmentLayout } from '@cloud/[team-slug]/[project-slug]/(tabs)/layout'

export default EnvironmentLayout

export async function generateMetadata({
  params: {
    'team-slug': teamSlug,
    'project-slug': projectSlug,
    'environment-slug': environmentSlug,
  },
}): Promise<Metadata> {
  return {
    title: {
      template: `${teamSlug} / ${projectSlug} | %s`,
      default: 'Project',
    },
    openGraph: mergeOpenGraph({
      title: `${teamSlug} / ${projectSlug} | %s`,
      url: `/cloud/${teamSlug}/${projectSlug}`,
    }),
  }
}
