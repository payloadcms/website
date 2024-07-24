import React from 'react'

import { IconProps } from '../types.js'

import classes from '../index.module.scss'

export const GradientBorderIcon: React.FC<IconProps> = props => {
  const { size, className, style } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="69"
      height="69"
      viewBox="0 0 69 69"
      fill="none"
      style={style}
      className={[className, classes.icon, size && classes[size]].filter(Boolean).join(' ')}
    >
      <circle cx="34.5" cy="34.5" r="33.5" stroke="url(#paint0_linear_4502_439)" strokeWidth="4" />
      <defs>
        <linearGradient
          id="paint0_linear_4502_439"
          x1="52.4376"
          y1="-8.56049"
          x2="-5.83957"
          y2="51.5721"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#007FAE" />
          <stop offset="0.653394" stopColor="#578A9C" />
          <stop offset="1" stopColor="#DFC198" />
        </linearGradient>
      </defs>
    </svg>
  )
}
