'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Gutter } from '../../../../components/Gutter'

import { CaseStudy } from '../../../../payload-types'

export const RenderCaseStudy: React.FC<CaseStudy> = props => {
  const { title, featuredImage, introContent, layout, link, meta } = props

  return (
    <Gutter>
      <h2>Case Study</h2>
      <Grid>{title}</Grid>
    </Gutter>
  )
}

export default RenderCaseStudy
