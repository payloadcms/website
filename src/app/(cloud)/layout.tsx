import { CloudFooter } from '@cloud/_components/CloudFooter/index.js'
import { CloudHeader } from '@cloud/_components/CloudHeader/index.js'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph.js'

import classes from './layout.module.scss'

export const metadata: Metadata = {
  title: {
    template: '%s | Payload Cloud',
    default: 'Payload Cloud',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payload',
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
      <div className={classes.container}>{children}</div>
      <CloudFooter />
    </div>
  )
}
