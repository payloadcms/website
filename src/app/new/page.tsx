import React, { Fragment } from 'react'
import { NewProjectBlock } from '@blocks/NewProject'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'
import { RenderParams } from '../_components/RenderParams'

const NewProjectPage: React.FC = () => {
  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      <NewProjectBlock headingElement="h1" />
    </Fragment>
  )
}

export default NewProjectPage

export const metadata: Metadata = {
  title: 'New Project | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'New Project | Payload Cloud',
    url: '/new',
  }),
}
