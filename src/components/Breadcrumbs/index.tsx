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
        const doEllipsis = (item?.label || '')?.length > 8

        if (item?.url && typeof item.url === 'string' && !isLast) {
          return (
            <React.Fragment key={index}>
              <label
                className={[classes.label, doEllipsis && classes.ellipsis]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Link href={item.url} prefetch={false} className={classes.labelContent}>
                  {item.label}
                </Link>
              </label>
              {!isLast && <p className={classes.divider}>&nbsp;&#47;&nbsp;</p>}
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={index}>
            <label
              className={[classes.label, doEllipsis && classes.ellipsis].filter(Boolean).join(' ')}
            >
              <div className={classes.labelContent}>{item.label}</div>
            </label>
            {!isLast && <p className={classes.divider}>&nbsp;/&nbsp;</p>}
          </React.Fragment>
        )
      })}
    </EdgeScroll>
  )
}
