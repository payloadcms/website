'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import { LoadingOverlay } from '@payloadcms/ui/elements/Loading'
import { StaggeredShimmers } from '@payloadcms/ui/elements/ShimmerEffect'
import {
  RouteTransitionProvider,
  useRouteTransition,
} from '@payloadcms/ui/providers/RouteTransition'
import { ProgressBar } from '@payloadcms/ui/providers/RouteTransition/ProgressBar'
import { Suspense, use, useEffect, useRef, useState } from 'react'

import type { PreviewExamples } from './types.js'

const LoadingOverlayDemo = () => {
  const [show, setShow] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  const showOverlay = () => {
    setShow(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setShow(false), 800)
  }

  return (
    <div className="payload-v4-preview__loading-demo">
      <Button disabled={show} margin={false} onClick={showOverlay}>
        Show loading overlay
      </Button>
      <LoadingOverlay animationDuration="160ms" show={show} />
    </div>
  )
}

const SimulatedRouteTransition = () => {
  const [delay, setDelay] = useState<null | Promise<void>>(null)
  const { startRouteTransition } = useRouteTransition()

  if (delay) {
    use(delay)
  }

  const beginTransition = () => {
    const nextDelay = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 650)
    })

    startRouteTransition(() => setDelay(nextDelay))
  }

  return (
    <Button margin={false} onClick={beginTransition}>
      Simulate route transition
    </Button>
  )
}

const ProgressBarDemo = () => (
  <RouteTransitionProvider>
    <div className="payload-v4-preview__progress-demo">
      <ProgressBar />
      <Suspense fallback={null}>
        <SimulatedRouteTransition />
      </Suspense>
    </div>
  </RouteTransitionProvider>
)

export const motionAndLoadingExamples: PreviewExamples = {
  overlay: <LoadingOverlayDemo />,
  progress: <ProgressBarDemo />,
  staggered: (
    <StaggeredShimmers
      className="payload-v4-preview__staggered-shimmers"
      count={4}
      height={12}
      renderDelay={0}
      shimmerDelay={75}
    />
  ),
}
