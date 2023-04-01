import * as React from 'react'
import Link from 'next/link'

import { EdgeScroll } from '@components/EdgeScroll'

import classes from './index.module.scss'

export type Breadcrumb = {
  label?: string
  url?: string
}

export type Props = {
  items?: Array<Breadcrumb>
}

export const Breadcrumbs: React.FC<Props> = ({ items }) => {
  return (
    <EdgeScroll element="nav" className={classes.breadcrumbs}>
      {items?.map((item, index) => {
        const isLast = index === items.length - 1

        if (item?.url && typeof item.url === 'string' && !isLast) {
          return (
            <React.Fragment key={index}>
              <label className={classes.label}>
                <Link href={item.url}>{item.label}</Link>
              </label>
              {!isLast && (
                <label className={classes.label}>
                  <span>&nbsp;&#47;&nbsp;</span>
                </label>
              )}
            </React.Fragment>
          )
        }

        return (
          <label key={index} className={classes.label}>
            {item.label}
            {!isLast && <span>&nbsp;/&nbsp;</span>}
          </label>
        )
      })}
    </EdgeScroll>
  )
}
