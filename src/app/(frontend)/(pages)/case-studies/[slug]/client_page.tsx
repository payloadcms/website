'use client'

import type { CaseStudy as CaseStudyT } from '@root/payload-types.js'

import { BackgroundGrid } from '@components/BackgroundGrid/index.js'
import { BlockWrapper } from '@components/BlockWrapper/index.js'
import { Gutter } from '@components/Gutter/index.js'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index.js'
import { Media } from '@components/Media/index.js'
import { RenderBlocks } from '@components/RenderBlocks/index.js'
import { RichText } from '@components/RichText/index.js'
import React from 'react'

import classes from './index.module.scss'

export const CaseStudy: React.FC<CaseStudyT> = props => {
  const { featuredImage, industry, introContent, layout, title, url, useCase } = props

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
            label: 'Visit Site',
            newTab: true,
            url: url ?? '',
          },
          {
            label: 'Book a demo',
            newTab: true,
            url: '/talk-to-us',
          },
        ]}
      />
      <BlockWrapper padding={{ top: 'small' }} settings={{}}>
        <BackgroundGrid />
        <Gutter className={classes.hero}>
          <div className={['grid'].filter(Boolean).join(' ')}>
            <div className={['cols-10 cols-m-8'].filter(Boolean).join(' ')}>
              <RichText className={classes.introContent} content={introContent} />
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
              <Media priority resource={featuredImage} />
            </div>
          )}
        </Gutter>
      </BlockWrapper>

      {Array.isArray(layout) && <RenderBlocks blocks={layout} />}
    </React.Fragment>
  )
}

export default CaseStudy
