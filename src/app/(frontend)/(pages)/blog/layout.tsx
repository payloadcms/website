import React from 'react'
import { Metadata } from 'next'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'

export default async ({ children }) => {
  return (
    <React.Fragment>
      <BreadcrumbsBar hero={{ type: 'default' }} breadcrumbs={[]} />
      {children}
    </React.Fragment>
  )
}

export const metadata: Metadata = {
  title: 'Blog | Payload',
  description:
    'The official Payload blog. Read about the product and keep up to date with new features.',
}
