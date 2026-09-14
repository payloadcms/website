'use client'

import { ErrorPill } from '@payloadcms/ui/elements/ErrorPill'
import { useTranslation } from '@payloadcms/ui/providers/Translation'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

const Demo = () => {
  const { i18n } = useTranslation()
  return (
    <div className={classes.row}>
      <ErrorPill count={1} i18n={i18n} />
      <ErrorPill count={12} i18n={i18n} />
      <ErrorPill count={120} i18n={i18n} />
    </div>
  )
}

export const errorPillExamples: ComponentRenders = {
  counts: {
    render: () => <Demo />,
  },
}
