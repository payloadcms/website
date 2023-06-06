import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { ProjectFromImportPage } from './client_page'

export default props => {
  return <ProjectFromImportPage {...props} />
}

export const metadata: Metadata = {
  title: 'Import Project | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Import Project | Payload Cloud',
    url: '/new/import',
  }),
}
