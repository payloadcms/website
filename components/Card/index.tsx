import React from 'react'
import { ContentMediaCard } from './ContentMediaCard'
import { SquareCard } from './SquareCard'
import { CardProps } from './types'

export const Card: React.FC<CardProps> = props => {
  const { cardType } = props

  switch (cardType) {
    case 'blog':
      return <ContentMediaCard {...props} />
    case 'square':
      return <SquareCard {...props} />
    default:
      return null
  }
}
