import classes from './index.module.scss'
import { Suspense } from 'react'

type BackgroundGradientProps = {
  className?: string
}

export default function BackgroundGradient(props: BackgroundGradientProps) {
  const { className } = props

  return (
    <div className={[className, classes.backgroundGradientWrapper].filter(Boolean).join(' ')}>
      <Suspense>
        <video autoPlay muted loop src="/images/glass-animation.mp4" playsInline={true} />
      </Suspense>
    </div>
  )
}
