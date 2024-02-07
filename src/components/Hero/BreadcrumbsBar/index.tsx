'use client'
import React, { useMemo } from 'react'

import { Breadcrumbs } from '@components/Breadcrumbs'
import { CMSLink } from '@components/CMSLink'
import { Gutter } from '@components/Gutter'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

interface Props {
  hero: Page['hero']
  breadcrumbs: Page['breadcrumbs']
}

const BreadcrumbsBar: React.FC<Props> = ({ hero, breadcrumbs: breadcrumbsProps }) => {
  const { breadcrumbsBarLinks, theme } = hero

  const breadcrumbs = useMemo(() => {
    return breadcrumbsProps?.slice(0, breadcrumbsProps.length - 1) ?? []
  }, [breadcrumbsProps])

  return (
    <div className={classes.wrapper} {...(theme ? { 'data-theme': theme } : {})}>
      <Gutter>
        <div className={classes.container}>
          {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}

          <div className={classes.links}>
            {Array.isArray(breadcrumbsBarLinks) &&
              breadcrumbsBarLinks.map(({ link }, i) => {
                return <CMSLink className={classes.link} key={i} {...link} appearance={undefined} />
              })}
          </div>
        </div>
      </Gutter>
    </div>
  )
}

export default BreadcrumbsBar
