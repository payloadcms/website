'use client'

import React from 'react'

import { Button } from '@components/Button'
import { DefaultCard } from '@components/cards/DefaultCard'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { PixelBackground } from '@components/PixelBackground'
import { useAuth } from '@root/providers/Auth'

import classes from './index.module.scss'

const NewProject: React.FC = () => {
  const { user } = useAuth()

  if (!user) {
    return (
      <Gutter>
        <h1>Create an account to get started.</h1>
        <Button label="Log in" href="/login" appearance="primary" />
      </Gutter>
    )
  }

  return (
    <Gutter>
      <div className={classes.header}>
        <div className={classes.headerContent}>
          <Heading element="h1" marginTop={false}>
            New project
          </Heading>
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
            href="/new/clone?template=blank"
            title="Blank CMS"
            description="An empty CMS, perfect for starting a new project from scratch."
          />
          <DefaultCard
            className={classes.card}
            leader={(2).toString().padStart(2, '0')}
            href="/new/clone?template=website"
            title="Website"
            description="The perfect starting point for a CMS to manage a website—large or small."
          />
          <DefaultCard
            className={classes.card}
            leader={(3).toString().padStart(2, '0')}
            href="/new/clone?template=ecommerce"
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
