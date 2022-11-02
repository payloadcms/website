import React from 'react'
import { fetchCaseStudies } from '../../graphql'
import { RenderCaseStudyArchive } from './renderCaseStudyArchive'

const Page = async () => {
  const caseStudies = await fetchCaseStudies()
  return <RenderCaseStudyArchive caseStudies={caseStudies} />
}

export default Page
