import React, { Fragment } from 'react'
import { NewProjectBlock } from '@blocks/NewProject'
import { Metadata } from 'next'

import { Gutter } from '@components/Gutter'
import { RenderParams } from '@root/app/_components/RenderParams'
import { mergeOpenGraph } from '@root/seo/mergeOpenGraph'

const ProjectFromTemplate: React.FC = () => {
  return (
    <Fragment>
      <Gutter>
        <RenderParams />
      </Gutter>
      <NewProjectBlock headingElement="h1" />
    </Fragment>
  )
}

export default ProjectFromTemplate

export const metadata: Metadata = {
  title: 'Clone Template | Payload Cloud',
  openGraph: mergeOpenGraph({
    title: 'Clone Template | Payload Cloud',
    url: '/new/clone',
  }),
}
