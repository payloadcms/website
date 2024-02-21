import { Metadata } from 'next'

import classes from './layout.module.scss'

export const metadata: Metadata = {
  title: {
    absolute: 'Styleguide',
    template: '%s | Styleguide',
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async ({ children }) => {
  return <div className={classes.layout}>{children}</div>
}
