'use client'

import React from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Media } from '@components/Media'
import { RenderBlocks } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import type { CaseStudy as CaseStudyT } from '@root/payload-types'

import classes from './index.module.scss'

export const CaseStudy: React.FC<CaseStudyT> = props => {
  const { title, featuredImage, introContent, layout, url } = props

  return (
    <React.Fragment>
      <Gutter className={classes.hero}>
        <Breadcrumbs
          items={[
            {
              label: 'Case Studies',
              url: `/case-studies`,
            },
            {
              label: title,
            },
          ]}
          ellipsis={false}
        />
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div className={['cols-10 cols-m-8'].filter(Boolean).join(' ')}>
            <RichText content={introContent} className={classes.introContent} />
          </div>

          <div
            className={[classes.visitSiteLink, 'cols-4 start-12 start-s-1 cols-s-8']
              .filter(Boolean)
              .join(' ')}
          >
            <Button
              appearance="default"
              el="a"
              href={url}
              newTab
              label="Visit Site"
              labelStyle="mono"
              icon="arrow"
              fullWidth
            />
          </div>
        </div>

        {typeof featuredImage !== 'string' && (
          <div className={classes.featuredMediaWrap}>
            <Media resource={featuredImage} priority />
          </div>
        )}
      </Gutter>

      {Array.isArray(layout) && <RenderBlocks blocks={layout} />}
    </React.Fragment>
  )
}

export default CaseStudy
