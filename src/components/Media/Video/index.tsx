'use client'

import React, { useEffect, useRef } from 'react'

import type { Props } from '../types'

import classes from './index.module.scss'

export const Video: React.FC<Props> = (props) => {
  const { onClick, resource, videoClassName } = props

  const videoRef = useRef<HTMLVideoElement>(null)
  // const [showFallback] = useState<boolean>()

  useEffect(() => {
    const { current: video } = videoRef
    if (video) {
      video.addEventListener('suspend', () => {
        // setShowFallback(true);
        // console.warn('Video was suspended, rendering fallback image.')
      })
    }
  }, [])

  if (resource && typeof resource !== 'string') {
    return (
      <video
        autoPlay
        className={[classes.video, videoClassName].filter(Boolean).join(' ')}
        controls={false}
        loop
        muted
        onClick={onClick}
        playsInline
        ref={videoRef}
      >
        <source src={resource.url || ''} />
      </video>
    )
  }

  return null
}
