import React from 'react'
import NextDynamicImport from 'next/dynamic.js'
const dynamic = (NextDynamicImport.default ||
  NextDynamicImport) as unknown as typeof NextDynamicImport.default

import classes from './index.module.scss'

const Component = dynamic(() => import('./Component.js'))

export const DocSearch: React.FC = () => {
  return (
    <div className={classes.docSearch}>
      <React.Suspense>
        <Component />
      </React.Suspense>
    </div>
  )
}
