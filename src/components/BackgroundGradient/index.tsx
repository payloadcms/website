'use client'

import Spline from '@splinetool/react-spline'

import classes from './index.module.scss'

type BackgroundGradientProps = {
  className?: string
}

export default function BackgroundGradient(props: BackgroundGradientProps) {
  const { className } = props
  return (
    <div className={[className, classes.backgroundGradientWrapper].filter(Boolean).join(' ')}>
      <Spline scene="https://prod.spline.design/ixkmxPOoQfMchkgQ/scene.splinecode" />
    </div>
  )
}
