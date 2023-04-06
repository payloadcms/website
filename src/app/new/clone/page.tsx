import React from 'react'
import { NewProjectBlock } from '@blocks/NewProject'
import { Metadata } from 'next'

const ProjectFromTemplate: React.FC = () => {
  return <NewProjectBlock />
}

export default ProjectFromTemplate

export const metadata: Metadata = {
  title: 'Clone Template | Payload Cloud',
}
