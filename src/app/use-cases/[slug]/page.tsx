import React from 'react'
import { fetchUseCase } from '../../../graphql'
import { RenderUseCase } from './render'

const CaseStudy = async ({ params }) => {
  const { slug } = params
  const useCase = await fetchUseCase(slug)

  return <RenderUseCase {...useCase} />
}

export default CaseStudy
