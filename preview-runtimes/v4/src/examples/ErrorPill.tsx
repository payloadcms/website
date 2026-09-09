'use client'

import { ErrorPill } from '@payloadcms/ui/elements/ErrorPill'
import { useTranslation } from '@payloadcms/ui/providers/Translation'

import type { PreviewExamples } from './types.js'

const ErrorPillDemo = () => {
  const { i18n } = useTranslation()

  return (
    <div className="payload-v4-preview__row">
      <ErrorPill count={1} i18n={i18n} />
      <ErrorPill count={12} i18n={i18n} />
      <ErrorPill count={120} i18n={i18n} />
      <ErrorPill count={3} i18n={i18n} withMessage />
    </div>
  )
}

export const errorPillExamples: PreviewExamples = {
  counts: <ErrorPillDemo />,
}
