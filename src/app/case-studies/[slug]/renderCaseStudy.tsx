'use client'

import React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { CaseStudy } from '@root/payload-types'
import { Button } from '../../../components/Button'
import { Gutter } from '../../../components/Gutter'
import { Media } from '../../../components/Media'
import { RenderBlocks } from '../../../components/RenderBlocks'
import { RichText } from '../../../components/RichText'

import classes from './index.module.scss'

export const RenderCaseStudy: React.FC<CaseStudy> = props => {
  const { title, featuredImage, introContent, layout, url, meta } = props

  // Need this until Next #42414 is fixed
  React.useEffect(() => {
    document.title = meta?.title || title
  })

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
        />
        <Grid>
          <Cell cols={9}>
            <RichText content={introContent} className={classes.introContent} />
          </Cell>

          <Cell start={10} cols={3} startS={1} colsS={8} className={classes.visitSiteLink}>
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
          </Cell>
        </Grid>

        {typeof featuredImage !== 'string' && (
          <div className={classes.featuredMediaWrap}>
            <Media resource={featuredImage} />
          </div>
        )}
      </Gutter>

      <RenderBlocks blocks={layout} />
    </React.Fragment>
  )
}

export default RenderCaseStudy
