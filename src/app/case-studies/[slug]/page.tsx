import { notFound } from 'next/navigation'
import React from 'react'
import { fetchCaseStudies, fetchCaseStudy } from '../../../graphql'
import { RenderCaseStudy } from './renderCaseStudy'

const CaseStudy = async ({ params }) => {
  const { slug } = params
  const caseStudy = await fetchCaseStudy(slug)

  if (!caseStudy) return notFound()

  return <RenderCaseStudy {...caseStudy} />
}

export default CaseStudy

export async function generateStaticParams() {
  const caseStudies = await fetchCaseStudies()

  return caseStudies.map(({ slug }) => ({
    slug,
  }))
}
