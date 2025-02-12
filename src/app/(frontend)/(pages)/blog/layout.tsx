import type { Metadata } from 'next'

import React from 'react'

export default async ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>
}

export const metadata: Metadata = {
  description:
    'The official Payload blog. Read about the product and keep up to date with new features.',
  title: 'Blog | Payload',
}
