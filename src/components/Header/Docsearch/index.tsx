import React from 'react'
import Dynamic from 'next/dynamic'

import classes from './index.module.scss'

const Component = Dynamic(() => import('./Component.js'))

export const DocSearch: React.FC = () => {
  return (
    <div className={classes.docSearch}>
      <React.Suspense>
        <Component />
      </React.Suspense>
    </div>
  )
}
