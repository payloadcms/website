import React, { Suspense } from 'react'

import classes from './index.module.scss'

type BackgroundGradientProps = {
  className?: string
}

export default function BackgroundGradient(props: BackgroundGradientProps) {
  const { className } = props

  return (
    <div className={[className, classes.backgroundGradientWrapper].filter(Boolean).join(' ')}>
      <Suspense>
        <video
          autoPlay
          loop
          muted
          playsInline
          src="https://l4wlsi8vxy8hre4v.public.blob.vercel-storage.com/video/glass-animation-5-f0gPcjmKFIV3ot5MGOdNy2r4QHBoXt.mp4"
        />
      </Suspense>
    </div>
  )
}
