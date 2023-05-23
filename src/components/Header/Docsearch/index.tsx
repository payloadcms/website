import React from 'react'
import dynamic from 'next/dynamic'

import classes from './index.module.scss'

const Component = dynamic(() => import('./Component'))

export const DocSearch: React.FC = () => {
  return (
    <div className={classes.docSearch}>
      <React.Suspense>
        <Component />
      </React.Suspense>
    </div>
  )
}
