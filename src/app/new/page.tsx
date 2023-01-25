'use client'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { useAuth } from '@root/providers/Auth'
import React, { useEffect } from 'react'
import { getImplicitPreference } from '@root/providers/Theme/shared'
import { useHeaderTheme } from '@root/providers/HeaderTheme'
import { PixelBackground } from '@components/PixelBackground'
import { DefaultCard } from '@components/cards/DefaultCard'

import classes from './index.module.scss'

const NewProject: React.FC = () => {
  const { user } = useAuth()
  const { setHeaderColor } = useHeaderTheme()

  useEffect(() => {
    const implicitPreference = getImplicitPreference()
    setHeaderColor(implicitPreference ?? 'light')
  }, [])

  if (!user) {
    return (
      <Gutter>
        <h1>You are not logged in.</h1>
        <Button label="Log in" href="/login" appearance="primary" />
      </Gutter>
    )
  }

  return (
    <Gutter>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <h1 className={classes.title}>New projects</h1>
          <p className={classes.description}>
            Create a project from a template, or import an existing Git codebase.
          </p>
        </div>
        <Button
          label="Import existing codebase"
          href="/new/import"
          appearance="default"
          el="link"
        />
      </div>
      <div className={classes.templatesWrapper}>
        <div className={classes.bg}>
          <PixelBackground />
        </div>
        <div className={classes.templates}>
          <DefaultCard
            className={classes.card}
            leader={(1).toString().padStart(2, '0')}
            href="/new/template?template=blank"
            title="Blank CMS"
            description="An empty CMS, perfect for starting a new project from scratch."
          />
          <DefaultCard
            className={classes.card}
            leader={(2).toString().padStart(2, '0')}
            href="/new/template?template=website"
            title="Website"
            description="The perfect starting point for a CMS to manage a website—large or small."
          />
          <DefaultCard
            className={classes.card}
            leader={(3).toString().padStart(2, '0')}
            href="/new/template?template=ecommerce"
            title="E-Commerce"
            description="A full e-commerce backend, integrated with Stripe and ready to sell."
          />
        </div>
      </div>
      <div className={classes.callToAction}>
        <h6>Payload Cloud is the best way to deploy a Payload project.</h6>
        <p>
          Get a quick-start with one of our pre-built templates, or deploy your own existing Payload
          codebase.
        </p>
      </div>
    </Gutter>
  )
}

export default NewProject
