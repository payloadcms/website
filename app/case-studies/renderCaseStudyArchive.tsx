'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import Link from 'next/link'
import { Gutter } from '../../components/Gutter'

import classes from './index.module.scss'

export const RenderCaseStudyArchive = ({ caseStudies }) => {
  return (
    <Gutter>
      <h2>Case Studies</h2>
      <Grid>
        {(caseStudies || []).map(caseStudy => (
          <Cell key={caseStudy.id} cols={6} className={classes.blogPost}>
            <Link href={`/case-studies/${caseStudy.slug}`}>
              <h5>{caseStudy.title}</h5>
            </Link>
          </Cell>
        ))}
      </Grid>
    </Gutter>
  )
}

export default RenderCaseStudyArchive
