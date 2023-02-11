import React from 'react'
import { notFound } from 'next/navigation'

import { fetchCaseStudies, fetchCaseStudy } from '../../../../graphql'
import { CaseStudy } from './CaseStudy'

const CaseStudyBySlug = async ({ params }) => {
  const { slug } = params
  const caseStudy = await fetchCaseStudy(slug)

  if (!caseStudy) return notFound()

  return <CaseStudy {...caseStudy} />
}

export default CaseStudyBySlug

export async function generateStaticParams() {
  const caseStudies = await fetchCaseStudies()

  return caseStudies.map(({ slug }) => ({
    slug,
  }))
}
