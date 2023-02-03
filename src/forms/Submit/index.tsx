'use client'

import React from 'react'

import { Button } from '@components/Button'
import { useFormProcessing } from '../Form/context'

const Submit: React.FC<{
  label?: string
  processing?: boolean
  className?: string
}> = props => {
  const { label, processing: processingFromProps, className } = props

  const processing = useFormProcessing()

  const isProcessing = processing || processingFromProps

  return (
    <Button
      htmlButtonType="submit"
      appearance="primary"
      icon={!isProcessing ? 'arrow' : undefined}
      label={isProcessing ? 'Processing...' : label || 'Submit'}
      className={className}
    />
  )
}

export default Submit
