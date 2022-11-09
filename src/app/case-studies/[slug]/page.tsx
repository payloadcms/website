import React from 'react'
import { fetchCaseStudy } from '../../../graphql'
import { RenderCaseStudy } from './renderCaseStudy'

const CaseStudy = async ({ params }) => {
  const { slug } = params
  const caseStudy = await fetchCaseStudy(slug)

  return <RenderCaseStudy {...caseStudy} />
}

export default CaseStudy
