import React from 'react'
import { NewProjectBlock } from '@blocks/NewProject'
import { Metadata } from 'next'

import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

const NewProjectPage: React.FC = () => {
  return <NewProjectBlock headingElement="h1" />
}

export default NewProjectPage

export const metadata: Metadata = {
  title: 'New Project | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'New Project | Payload Cloud',
    url: '/new',
  }),
}
