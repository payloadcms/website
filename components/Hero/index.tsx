import React from 'react'
import { Page } from '../../payload-types'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'

const heroes = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
}

export const Hero: React.FC<Page['hero']> = props => {
  const { type } = props
  const HeroToRender = heroes[type]
  return <HeroToRender {...props} />
}
