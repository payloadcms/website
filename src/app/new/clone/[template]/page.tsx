import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectFromTemplatePage } from './client_page'

export default ({ params }) => {
  return <ProjectFromTemplatePage params={params} />
}

export async function generateMetadata({ params: { template } }): Promise<Metadata> {
  return {
    title: 'Clone Template | Payload Cloud',
    openGraph: mergeOpenGraph({
      url: `/new/clone/${template}`,
    }),
  }
}
