import React from 'react'
import { NewProjectBlock } from '@blocks/NewProject'
import { Metadata } from 'next'

const NewProjectPage: React.FC = () => {
  return <NewProjectBlock headingElement="h1" />
}

export default NewProjectPage

export const metadata: Metadata = {
  title: 'New Project | Payload Cloud',
}
