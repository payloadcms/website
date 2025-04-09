import { EdgeScroll } from '@components/EdgeScroll/index'
import Link from 'next/link'
import * as React from 'react'

import classes from './index.module.scss'

export type Breadcrumb = {
  label?: null | React.ReactNode | string
  url?: null | string
}

export type Props = {
  className?: string
  ellipsis?: boolean
  items?: Array<Breadcrumb> | null
}

export const Breadcrumbs: React.FC<Props> = ({ className, ellipsis = true, items }) => {
  return (
    <nav
      aria-label="Breadcrumbs navigation"
      className={[classes.breadcrumbs, className].filter(Boolean).join(' ')}
    >
      {items?.map((item, index) => {
        const isLast = index === items.length - 1
        const doEllipsis =
          ellipsis && typeof item.label === 'string' && (item?.label || '')?.length > 8 && !isLast

        if (item?.url && typeof item.url === 'string') {
          return (
            <React.Fragment key={index}>
              <div
                className={[classes.label, doEllipsis && classes.ellipsis]
                  .filter(Boolean)
                  .join(' ')}
              >
                <Link className={classes.labelContent} href={item.url} prefetch={false}>
                  {item.label}
                </Link>
              </div>
              {!isLast && <p className={classes.divider}>&nbsp;&#47;&nbsp;</p>}
            </React.Fragment>
          )
        }

        return (
          <React.Fragment key={index}>
            <div
              className={[classes.label, doEllipsis && classes.ellipsis].filter(Boolean).join(' ')}
            >
              <div className={classes.labelContent}>{item.label}</div>
            </div>
            {!isLast && <p className={classes.divider}>&nbsp;/&nbsp;</p>}
          </React.Fragment>
        )
      })}
    </nav>
  )
}
