'use client'

import type { CaseStudy as CaseStudyT } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { Gutter } from '@components/Gutter/index'
import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index'
import { Media } from '@components/Media/index'
import { RenderBlocks } from '@components/RenderBlocks/index'
import { RichText } from '@components/RichText/index'
import { ArrowIcon } from '@icons/ArrowIcon'
import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'

export const CaseStudy: React.FC<CaseStudyT> = (props) => {
  const { featuredImage, industry, introContent, layout, partner, title, url, useCase } = props

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
            <div className={['cols-6 cols-m-8', classes.content].filter(Boolean).join(' ')}>
              <div className={classes.titleWrap}>
                <RichText className={classes.introContent} content={introContent} />
              </div>
              {(industry || useCase) && (
                <div className={[classes.metaWrapper].filter(Boolean).join(' ')}>
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
                  {partner && typeof partner !== 'string' && (
                    <Link
                      className={[classes.metaItem].filter(Boolean).join(' ')}
                      href={'/partners/' + partner.slug}
                    >
                      <p className={[classes.metaLabel].filter(Boolean).join(' ')}>Partner</p>
                      <p className={[classes.metaValue].filter(Boolean).join(' ')}>
                        {partner.name}
                      </p>
                      <ArrowIcon className={classes.arrow} />
                    </Link>
                  )}
                </div>
              )}
            </div>
            {typeof featuredImage !== 'string' && (
              <div className="cols-8 start-8 start-m-1">
                <Media className={classes.featuredImage} priority resource={featuredImage} />
              </div>
            )}
          </div>
        </Gutter>
      </BlockWrapper>

      {Array.isArray(layout) && <RenderBlocks blocks={layout} />}
    </React.Fragment>
  )
}

export default CaseStudy
