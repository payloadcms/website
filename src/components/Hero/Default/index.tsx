'use client'

import React from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { RichText } from '@components/RichText'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export const DefaultHero: React.FC<
  Pick<Page['hero'], 'richText' | 'sidebarContent'> & {
    breadcrumbs?: Page['breadcrumbs']
  }
> = ({ richText, sidebarContent, breadcrumbs }) => {
  const withoutSidebar =
    !sidebarContent ||
    (sidebarContent.length === 1 &&
      Array.isArray(sidebarContent[0].children) &&
      sidebarContent[0].children?.length === 1 &&
      !sidebarContent[0].children[0].text)

  return (
    <Gutter>
      <div className={classes.defaultHero}>
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} ellipsis={false} />}
        <div className={['grid'].filter(Boolean).join(' ')}>
          <div
            className={[
              `cols-${withoutSidebar ? 12 : 10}`,
              `cols-m-${withoutSidebar ? 7 : 5}`,
              'cols-s-8',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <RichText className={classes.richText} content={richText} />
          </div>

          {!withoutSidebar && (
            <div
              className={['cols-4 start-12 start-m-6 cols-s-8 start-s-1'].filter(Boolean).join(' ')}
            >
              <RichText content={sidebarContent} />
            </div>
          )}
        </div>
      </div>
    </Gutter>
  )
}
