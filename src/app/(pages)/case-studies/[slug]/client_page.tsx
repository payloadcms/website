'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { BlockWrapper } from '@components/BlockWrapper'
import { Gutter } from '@components/Gutter'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar'
import { Media } from '@components/Media'
import { RenderBlocks } from '@components/RenderBlocks'
import { RichText } from '@components/RichText'
import type { CaseStudy as CaseStudyT } from '@root/payload-types'

import classes from './index.module.scss'

export const CaseStudy: React.FC<CaseStudyT> = props => {
  const { title, featuredImage, introContent, layout, url, industry, useCase } = props

  return (
    <React.Fragment>
      <BreadcrumbsBar
        breadcrumbs={[
          {
            label: 'Case Studies',
            url: `/case-studies`,
          },
          {
            label: title,
          },
        ]}
        links={[
          {
            newTab: true,
            icon: 'arrow',
            url: url ?? '',
            label: 'Visit Site',
          },
          {
            newTab: true,
            icon: 'arrow',
            url: '/talk-to-us',
            label: 'Book a demo',
          },
        ]}
      />
      <BlockWrapper settings={{}} padding={{ top: 'small' }}>
        <BackgroundGrid />
        <Gutter className={classes.hero}>
          <div className={['grid'].filter(Boolean).join(' ')}>
            <div className={['cols-10 cols-m-8'].filter(Boolean).join(' ')}>
              <RichText content={introContent} className={classes.introContent} />
            </div>

            {(industry || useCase) && (
              <div
                className={[
                  classes.metaWrapper,
                  'cols-4 start-13 cols-m-8 start-m-1 start-s-1 cols-s-8',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {industry && (
                  <div className={[classes.metaItem].filter(Boolean).join(' ')}>
                    <p className={[classes.metaLabel].filter(Boolean).join(' ')}>Industry</p>
                    <p className={[classes.metaValue].filter(Boolean).join(' ')}>{industry}</p>
                  </div>
                )}

                {useCase && (
                  <div className={[classes.metaItem].filter(Boolean).join(' ')}>
                    <p className={[classes.metaLabel].filter(Boolean).join(' ')}>Use case</p>
                    <p className={[classes.metaValue].filter(Boolean).join(' ')}>{useCase}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {typeof featuredImage !== 'string' && (
            <div className={classes.featuredMediaWrap}>
              <Media resource={featuredImage} priority />
            </div>
          )}
        </Gutter>
      </BlockWrapper>

      {Array.isArray(layout) && <RenderBlocks blocks={layout} />}
    </React.Fragment>
  )
}

export default CaseStudy
