'use client'

import React, { forwardRef } from 'react'

import { Button, ButtonProps } from '@components/Button/index.js'
import { useFormProcessing } from '../Form/context.js'

type SubmitProps = ButtonProps & {
  label?: string | null
  processing?: boolean
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    label,
    processing: processingFromProps,
    className,
    appearance = 'primary',
    size = 'default',
    icon = 'arrow',
    disabled,
  } = props

  const processing = useFormProcessing()
  const isProcessing = processing || processingFromProps

  return (
    <Button
      ref={ref}
      htmlButtonType="submit"
      appearance={appearance}
      size={size}
      icon={icon && !isProcessing ? icon : undefined}
      label={isProcessing ? 'Processing...' : label || 'Submit'}
      className={className}
      disabled={isProcessing || disabled}
    />
  )
})

export default Submit
