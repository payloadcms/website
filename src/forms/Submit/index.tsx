'use client'

import React from 'react'

import { Button, ButtonProps } from '@components/Button'
import { useFormProcessing } from '../Form/context'

const Submit: React.FC<
  {
    label?: string
    processing?: boolean
    className?: string
    icon?: boolean
  } & Pick<ButtonProps, 'size' | 'appearance'>
> = props => {
  const {
    label,
    processing: processingFromProps,
    className,
    appearance = 'primary',
    size = 'default',
    icon = true,
  } = props

  const processing = useFormProcessing()
  const isProcessing = processing || processingFromProps

  return (
    <Button
      htmlButtonType="submit"
      appearance={appearance}
      size={size}
      icon={icon && !isProcessing ? 'arrow' : undefined}
      label={isProcessing ? 'Processing...' : label || 'Submit'}
      className={className}
    />
  )
}

export default Submit
