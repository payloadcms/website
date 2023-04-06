import { Metadata } from 'next'

import { ProjectFromTemplatePage } from './client_page'

export default ({ params }) => {
  return <ProjectFromTemplatePage params={params} />
}

export async function generateMetadata({ params: { template } }): Promise<Metadata> {
  return {
    title: 'Clone Template | Payload Cloud',
    openGraph: {
      url: `/new/clone/${template}`,
    },
  }
}
