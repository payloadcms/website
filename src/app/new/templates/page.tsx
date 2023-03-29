'use client'

import React, { Fragment } from 'react'
import { TemplatesBlock } from '@blocks/TemplatesBlock'
import Link from 'next/link'

import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'

import classes from './index.module.scss'

const Templates: React.FC = () => {
  return (
    <Fragment>
      <Gutter>
        <Heading marginTop={false}>Select a template</Heading>
        <p className={classes.description}>
          {`Pre-made configurations for every use case without additional setup. You can also `}
          <Link href="/new/import">import an existing codebase</Link>
          {'.'}
        </p>
      </Gutter>
      <TemplatesBlock />
    </Fragment>
  )
}

export default Templates
