import type { Metadata } from 'next'

import { BannerBlockPage } from './client_page'

export default (props) => {
  return <BannerBlockPage {...props} />
}

export const metadata: Metadata = {
  title: 'Banners',
}
