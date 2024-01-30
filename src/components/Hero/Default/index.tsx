'use client'

import React from 'react'

import { BackgroundGrid } from '@components/BackgroundGrid'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const DefaultHero: React.FC<
  Pick<Page['hero'], 'richText' | 'description'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, description, breadcrumbs }) => {
  const withoutSidebar =
    !description ||
    (description.length === 1 &&
      Array.isArray(description[0].children) &&
      description[0].children?.length === 1 &&
      !description[0].children[0].text)

  return (
    <Gutter>
      <div className={classes.defaultHero}>
        <BackgroundGrid ignoreGutter />
        <div className={[classes.container, 'grid'].filter(Boolean).join(' ')}>
          <div className={[`cols-8 start-1`, `cols-m-8`, 'cols-s-8'].filter(Boolean).join(' ')}>
            {breadcrumbs && (
              <Breadcrumbs items={breadcrumbs} ellipsis={false} className={classes.label} />
            )}
            <RichText className={classes.richText} content={richText} />
          </div>

          {!withoutSidebar && (
            <div className={['cols-4 start-13 cols-m-8 start-m-1'].filter(Boolean).join(' ')}>
              <RichText content={description} />
            </div>
          )}
        </div>
      </div>
    </Gutter>
  )
}
