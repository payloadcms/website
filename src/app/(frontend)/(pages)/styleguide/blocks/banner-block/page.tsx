import { Metadata } from 'next'

import { BannerBlockPage } from './client_page.js'

export default props => {
  return <BannerBlockPage {...props} />
}

export const metadata: Metadata = {
  title: 'Banners',
}
