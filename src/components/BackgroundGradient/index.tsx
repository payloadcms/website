import Spline from '@splinetool/react-spline/next'

import classes from './index.module.scss'

type BackgroundGradientProps = {
  className?: string
}

export default function BackgroundGradient(props: BackgroundGradientProps) {
  const { className } = props
  return (
    <div className={[className, classes.backgroundGradientWrapper].filter(Boolean).join(' ')}>
      <Spline scene="https://prod.spline.design/CgEYt8e8SZrHsfcR/scene.splinecode" />
    </div>
  )
}
