import React from 'react'

import classes from './index.module.scss'

export const LoadingShimmer: React.FC<{
  number?: number
  height?: number // in `base` units
  width?: number // in `base` units
  className?: string
  shimmerClassName?: string
  heightPercent?: number
}> = props => {
  const { height: heightBase, heightPercent, number, className, shimmerClassName } = props

  const arrayFromNumber = Array.from(Array(number || 1).keys())

  let height = heightBase ? `calc(${heightBase} * 1rem)` : undefined
  if (typeof heightPercent === 'number') {
    height = `${heightPercent}%`
  }

  return (
    <div className={[className, classes.loading].filter(Boolean).join(' ')}>
      {arrayFromNumber.map((_, index) => (
        <div
          key={index}
          className={[shimmerClassName, classes.shimmer].filter(Boolean).join(' ')}
          style={{
            height,
            width: props.width ? `calc(${props.width} * 1rem)` : undefined,
          }}
        />
      ))}
    </div>
  )
}
