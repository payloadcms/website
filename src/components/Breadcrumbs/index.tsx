import Link from 'next/link'
import * as React from 'react'
import classes from './index.module.scss'

type Props = {
  items?: Array<{
    label?: string
    url?: string
  }>
}

export const Breadcrumbs: React.FC<Props> = ({ items }) => {
  return (
    <nav className={classes.breadcrumbs}>
      {items?.map((item, index) => {
        const isLast = index === items.length - 1

        if (item?.url && typeof item.url === 'string' && !isLast) {
          return (
            <React.Fragment key={index}>
              <label>
                <Link href={item.url}>{item.label}</Link>
              </label>

              {!isLast && (
                <label>
                  <span>&nbsp;&#47;&nbsp;</span>
                </label>
              )}
            </React.Fragment>
          )
        }

        return (
          <label key={index}>
            {item.label}
            {!isLast && <span>&nbsp;&sol;&nbsp;</span>}
          </label>
        )
      })}
    </nav>
  )
}
