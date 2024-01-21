import React from 'react'

import classes from './index.module.scss'

export const BackgroundGrid: React.FC = () => {
  return (
    <div className={[classes.backgroundGrid, 'grid'].filter(Boolean).join(' ')}>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
      <div className={[classes.column, 'cols-4'].filter(Boolean).join(' ')}></div>
    </div>
  )
}
