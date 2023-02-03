'use client'

import React, { useEffect } from 'react'

import { Button } from '@components/Button'
import { DefaultCard } from '@components/cards/DefaultCard'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { PixelBackground } from '@components/PixelBackground'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import templatesJSON from './templates.json'

import classes from './index.module.scss'

const Templates: React.FC = () => {
  const { setHeaderColor } = useHeaderTheme()

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  return (
    <Gutter>
      <Heading marginTop={false}>Select a template</Heading>
      <p>Pre-made configurations for every use case without additional setup.</p>
      <Button appearance="primary" label="New project" href="/new" el="link" />
      <div className={classes.templatesWrapper}>
        <div className={classes.bg}>
          <PixelBackground />
        </div>
        <div className={classes.templates}>
          {templatesJSON.map((template, index) => (
            <DefaultCard
              className={classes.card}
              leader={(index + 1).toString().padStart(2, '0')}
              href={`/new/clone?template=${template.name}`}
              title={template.label}
              description=""
            />
          ))}
        </div>
      </div>
    </Gutter>
  )
}

export default Templates
