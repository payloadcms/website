'use client'

import React from 'react'

import { DefaultCard } from '@components/cards/DefaultCard'
import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
import { useGlobals } from '@root/providers/Globals'

import classes from './index.module.scss'

export const TemplatesBlock: React.FC<{}> = () => {
  const { templates } = useGlobals()

  return (
    <Gutter className={classes.cardGrid}>
      <div className={classes.templatesWrapper}>
        <div className={classes.bg}>
          <PixelBackground />
        </div>
        <div className={classes.templates}>
          {templates.map((template, index) => (
            <DefaultCard
              key={template.slug}
              className={classes.card}
              leader={(index + 1).toString().padStart(2, '0')}
              href={`/new/clone/${template.slug}`}
              title={template.name}
              description={template.description}
            />
          ))}
        </div>
      </div>
    </Gutter>
  )
}
