import React from 'react'
import { Page } from '../../payload-types'
import { ContentMediaHero } from './ContentMedia'
import { DefaultHero } from './Default'
import { FormHero } from './FormHero'
import { HomeHero } from './Home'

const heroes = {
  default: DefaultHero,
  contentMedia: ContentMediaHero,
  home: HomeHero,
  form: FormHero,
}

export const Hero: React.FC<{
  page: Page
}> = props => {
  const {
    page: {
      title,
      hero,
      hero: { type },
    },
  } = props

  const HeroToRender = heroes[type]

  if (HeroToRender) {
    return <HeroToRender pageTitle={title} {...hero} />
  }
  return null
}
