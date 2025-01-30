import type { TemplateCardsBlock } from '@root/payload-types'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type TemplateCardType = NonNullable<Pick<TemplateCardsBlock, 'templates'>['templates']>[0]

import { ArrowIcon } from '@icons/ArrowIcon'

import classes from './index.module.scss'

const TemplateCard = (props: TemplateCardType) => {
  const { name, slug, description, image } = props

  return (
    <Link className={classes.templateCard} href={`/new/clone/${slug}`}>
      <div className={classes.imageContainer}>
        <Image alt={`${name} template thumbnail image`} fill src={image} />
      </div>
      <div className={classes.templateCardContent}>
        <h5>
          {name} <ArrowIcon className={classes.arrow} />
        </h5>
        <p>{description}</p>
      </div>
    </Link>
  )
}

export const TemplateCards: React.FC<{ templates: TemplateCardType[] }> = (props) => {
  const { templates } = props

  return (
    templates &&
    Array.isArray(templates) &&
    templates.length > 0 && (
      <div className={classes.templateCardWrapper}>
        {templates.map((template) => (
          <TemplateCard key={template.id} {...template} />
        ))}
      </div>
    )
  )
}
