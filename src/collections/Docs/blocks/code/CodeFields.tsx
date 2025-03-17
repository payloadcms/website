'use client'

import type { CodeFieldClientProps } from 'payload'

import { CodeField, useFormFields } from '@payloadcms/ui'
import React, { useMemo } from 'react'

import { languages } from '../shared'

const languageKeyToMonacoLanguageMap = {
  plaintext: 'plaintext',
  ts: 'typescript',
  tsx: 'typescript',
}

export const Code: React.FC<CodeFieldClientProps> = ({
  autoComplete,
  field,
  forceRender,
  path,
  permissions,
  readOnly,
  renderedBlocks,
  schemaPath,
  validate,
}) => {
  const languageField = useFormFields(([fields]) => fields['language'])

  const language: string =
    (languageField?.value as string) || (languageField?.initialValue as string) || 'typescript'

  const label = languages[language as keyof typeof languages]

  const props: typeof field = useMemo(
    () => ({
      ...field,
      admin: {
        ...field.admin,
        editorOptions: field.admin?.editorOptions || {},
        label,
        language: languageKeyToMonacoLanguageMap[language] || language,
      },
    }),
    [field, language, label],
  )

  const key = `${field.name}-${language}-${label}`

  return (
    <CodeField
      autoComplete={autoComplete}
      field={props}
      forceRender={forceRender}
      key={key}
      path={path}
      permissions={permissions}
      readOnly={readOnly}
      renderedBlocks={renderedBlocks}
      schemaPath={schemaPath}
      validate={validate}
    />
  )
}
