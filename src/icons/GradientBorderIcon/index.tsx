import React from 'react'

import type { IconProps } from '../types'

import classes from '../index.module.scss'

export const GradientBorderIcon: React.FC<IconProps> = (props) => {
  const { className, size, style } = props

  return (
    <svg
      className={[className, classes.icon, size && classes[size]].filter(Boolean).join(' ')}
      fill="none"
      height="69"
      style={style}
      viewBox="0 0 69 69"
      width="69"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="34.5" cy="34.5" r="33.5" stroke="url(#paint0_linear_4502_439)" strokeWidth="4" />
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="paint0_linear_4502_439"
          x1="52.4376"
          x2="-5.83957"
          y1="-8.56049"
          y2="51.5721"
        >
          <stop stopColor="#007FAE" />
          <stop offset="0.653394" stopColor="#578A9C" />
          <stop offset="1" stopColor="#DFC198" />
        </linearGradient>
      </defs>
    </svg>
  )
}
