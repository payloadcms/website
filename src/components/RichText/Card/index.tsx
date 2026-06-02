import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import React from 'react'

import './index.scss'

interface CardProps {
  description: string
  link: string
  title: string
}

export const Card: React.FC<CardProps> = ({ description, link, title }) => {
  return (
    <a className="docs-card" href={link}>
      <div className="docs-card__title-row">
        <h4 className="docs-card__title">{title}</h4>
        <ArrowIcon className="docs-card__icon" />
      </div>
      <p className="docs-card__description">{description}</p>
      <BackgroundScanline className="docs-card__scanlines" />
    </a>
  )
}
