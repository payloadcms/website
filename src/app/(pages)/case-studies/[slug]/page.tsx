import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { fetchCaseStudies, fetchCaseStudy } from '../../../../graphql'
import { CaseStudy } from './client_page'

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

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const caseStudy = await fetchCaseStudy(slug)

  return {
    title: `${caseStudy?.meta?.title} | Payload CMS`,
    description: caseStudy?.meta?.description,
    openGraph: {
      url: `/case-studies/${slug}`,
      description: caseStudy?.meta?.description,
      images: [
        {
          url:
            typeof caseStudy.meta?.image === 'object' && caseStudy.meta.image?.url
              ? caseStudy.meta.image.url
              : '',
        },
      ],
    },
  }
}
