import { CloudHeader } from '@cloud/_components/CloudHeader'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

import classes from './layout.module.scss'

export const metadata: Metadata = {
  title: {
    template: '%s | Payload Cloud',
    default: 'Payload Cloud',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload CMS',
    description: 'The Node & React TypeScript Headless CMS',
    creator: '@payloadcms',
  },
  // TODO: Add cloud graphic
  openGraph: mergeOpenGraph(),
}

export default async props => {
  const { children } = props

  return (
    <div className={classes.layout}>
      <CloudHeader />
      {children}
    </div>
  )
}
