'use client'

import { useFormField } from '@forms/useFormField'
import {
  FormSubmit,
  useConfig,
  useDocumentInfo,
  useEditDepth,
  useForm,
  useFormModified,
  useHotkey,
  useLocale,
  useOperation,
} from '@payloadcms/ui'
import { useSearchParams } from 'next/navigation'
import * as qs from 'qs-esm'
import React, { useRef } from 'react'

export const SaveButtonClient: React.FC = () => {
  const { submit } = useForm()
  const modified = useFormModified()
  const versionField = useFormField(([fields]) => fields.version)

  const { id, collectionSlug } = useDocumentInfo()
  const ref = useRef<HTMLButtonElement>(null)
  const editDepth = useEditDepth()
  const operation = useOperation()
  const searchParams = useSearchParams()

  const forceDisable = operation === 'update' && !modified

  const { code: locale } = useLocale()

  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()

  const baseURL = `${serverURL}${api}`

  const action: string = React.useMemo(() => {
    const docURL = `${baseURL}/${collectionSlug}${id ? `/${id}` : ''}`
    const params = {
      branch: searchParams.get('branch') ?? (versionField?.value === 'v2' ? '2.x' : 'main'),
      commit: true,
      depth: 0,
      'fallback-locale': 'null',
      locale,
    }

    return `${docURL}${qs.stringify(params, {
      addQueryPrefix: true,
    })}`
  }, [baseURL, collectionSlug, id, locale, searchParams, versionField?.value])

  useHotkey({ cmdCtrlKey: true, editDepth, keyCodes: ['s'] }, (e) => {
    if (forceDisable) {
      // absorb the event
    }

    e.preventDefault()
    e.stopPropagation()
    if (ref?.current) {
      ref.current.click()
    }
  })

  const handleSubmit = () => {
    return void submit({ action })
  }

  return (
    <FormSubmit
      buttonId="action-save"
      disabled={forceDisable}
      onClick={handleSubmit}
      ref={ref}
      size="medium"
      type="button"
    >
      Save And Commit
    </FormSubmit>
  )
}
