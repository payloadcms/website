import type { Metadata } from 'next'

import classes from './layout.module.scss'

export const metadata: Metadata = {
  robots: {
    follow: true,
    googleBot: {
      follow: false,
      index: false,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      noimageindex: true,
    },
    index: false,
    nocache: true,
  },
  title: {
    absolute: 'Styleguide',
    template: '%s | Styleguide',
  },
}

export default async ({ children }) => {
  return <div className={classes.layout}>{children}</div>
}
