'use client'

import React from 'react'
import { useFormProcessing } from '../Form/context'
import { Button } from '../../Button'

const Submit: React.FC<{
  label?: string
  processing?: boolean
}> = props => {
  const { label = 'Submit', processing: processingFromProps } = props

  const processing = useFormProcessing()

  const isProcessing = processing || processingFromProps

  return (
    <Button
      htmlButtonType="submit"
      appearance="primary"
      icon={!isProcessing ? 'arrow' : undefined}
      label={isProcessing ? 'Processing...' : label}
    />
  )
}

export default Submit
