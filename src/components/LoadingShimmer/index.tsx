import React from 'react'

import classes from './index.module.scss'

export const LoadingShimmer: React.FC<{
  className?: string
  height?: number // in `base` units
  heightPercent?: number
  number?: number
  shimmerClassName?: string
  width?: number // in `base` units
}> = (props) => {
  const { className, height: heightBase, heightPercent, number, shimmerClassName } = props

  const arrayFromNumber = Array.from(Array(number || 1).keys())

  let height = heightBase ? `calc(${heightBase} * 1rem)` : undefined
  if (typeof heightPercent === 'number') {
    height = `${heightPercent}%`
  }

  return (
    <div className={[className, classes.loading].filter(Boolean).join(' ')}>
      {arrayFromNumber.map((_, index) => (
        <div
          className={[shimmerClassName, classes.shimmer].filter(Boolean).join(' ')}
          key={index}
          style={{
            height,
            width: props.width ? `calc(${props.width} * 1rem)` : undefined,
          }}
        />
      ))}
    </div>
  )
}
