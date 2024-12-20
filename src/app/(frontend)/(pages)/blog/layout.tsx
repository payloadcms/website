import type { Metadata } from 'next'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import React from 'react'

export default async ({ children }) => {
  return (
    <React.Fragment>
      <BreadcrumbsBar breadcrumbs={[]} hero={{ type: 'default' }} />
      {children}
    </React.Fragment>
  )
}

export const metadata: Metadata = {
  description:
    'The official Payload blog. Read about the product and keep up to date with new features.',
  title: 'Blog | Payload',
}
