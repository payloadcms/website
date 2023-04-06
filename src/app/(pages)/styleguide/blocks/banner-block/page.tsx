import { Metadata } from 'next'

import { BannerBlockPage } from './client_page'

export default () => {
  return <BannerBlockPage />
}

export const metadata: Metadata = {
  title: 'Banners',
}
