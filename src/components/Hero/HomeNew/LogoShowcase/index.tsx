import type { Media as MediaType } from '@root/payload-types'

import { BackgroundScanline } from '@components/BackgroundScanline'
import { Media } from '@components/Media/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import React, { useEffect, useState } from 'react'

import classes from './index.module.scss'

type LogoItem = MediaType

export const LogoShowcase: React.FC<{ logos: Array<MediaType> }> = ({ logos }) => {
  const [activeLogos, setActiveLogos] = useState<LogoItem[]>([])
  const [animatingIndex, setAnimatingIndex] = useState<null | number>(null)
  const [inactiveLogos, setInactiveLogos] = useState<LogoItem[]>([])

  useEffect(() => {
    if (logos) {
      const active = logos.slice(0, 6)
      const inactive = logos.slice(6)
      setActiveLogos(active)
      setInactiveLogos(inactive)
    }
  }, [logos])

  useEffect(() => {
    if (!logos || logos.length === 0 || logos.length <= 6) {
      return
    }

    const interval = setInterval(() => {
      const nextIndex = Math.floor(Math.random() * 6)
      setAnimatingIndex(nextIndex)
      setTimeout(() => swapLogo(nextIndex), 1000)
      setTimeout(() => setAnimatingIndex(null), 1500)
    }, 3000)

    return () => clearInterval(interval)
  })

  const swapLogo = (index) => {
    const newActive = [...activeLogos]
    const newInactive = [...inactiveLogos]

    const newLogo = newInactive.shift() as LogoItem
    newInactive.push(newActive[index])
    newActive[index] = newLogo

    setActiveLogos(newActive)
    setInactiveLogos(newInactive)
  }

  return (
    <div className={classes.logoGrid}>
      {activeLogos.map((logo, index) => (
        <Cell active={animatingIndex} index={index} key={index} logo={logo} />
      ))}
      <CrosshairIcon className={classes.crosshairTop} />
      <CrosshairIcon className={classes.crosshairBottom} />
    </div>
  )
}

export const Cell = ({
  active,
  index,
  logo,
}: {
  active: null | number
  index: number
  logo: LogoItem
}) => {
  const isActive = active === index
  return (
    <div className={[isActive && classes.active, classes.logoItem].filter(Boolean).join(' ')}>
      <Media className={classes.logo} resource={logo} />
      <BackgroundScanline className={classes.scanline} />
    </div>
  )
}
