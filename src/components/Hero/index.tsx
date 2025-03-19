import type { BlocksProp } from '@components/RenderBlocks/index'
import type { Page } from '@root/payload-types'

import BreadcrumbsBar from '@components/Hero/BreadcrumbsBar/index'
import React from 'react'

import { CenteredContent } from './CenteredContent/index'
import { ContentMediaHero } from './ContentMedia/index'
import { DefaultHero } from './Default/index'
import { FormHero } from './FormHero/index'
import { GradientHero } from './Gradient/index'
import { HomeHero } from './Home/index'
import { HomeNewHero } from './HomeNew/index'
import { LivestreamHero } from './Livestream/index'
import { ThreeHero } from './Three/index'

const heroes = {
  centeredContent: CenteredContent,
  contentMedia: ContentMediaHero,
  default: DefaultHero,
  form: FormHero,
  gradient: GradientHero,
  home: HomeHero,
  homeNew: HomeNewHero,
  livestream: LivestreamHero,
  three: ThreeHero,
}

export const Hero: React.FC<{
  firstContentBlock?: BlocksProp
  page: Page
}> = (props) => {
  const {
    firstContentBlock,
    page: {
      breadcrumbs,
      hero,
      hero: { type },
    },
  } = props

  const HeroToRender = heroes[type] as any

  if (HeroToRender) {
    return (
      <>
        <BreadcrumbsBar breadcrumbs={breadcrumbs} hero={hero} />

        <HeroToRender {...hero} breadcrumbs={breadcrumbs} firstContentBlock={firstContentBlock} />
      </>
    )
  }

  return null
}
