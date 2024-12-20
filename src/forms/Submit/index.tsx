'use client'

import type { ButtonProps } from '@components/Button/index.js'

import { Button } from '@components/Button/index.js'
import React, { forwardRef } from 'react'

import { useFormProcessing } from '../Form/context.js'

type SubmitProps = {
  label?: null | string
  processing?: boolean
} & ButtonProps

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    appearance = 'primary',
    className,
    disabled,
    icon = 'arrow',
    label,
    processing: processingFromProps,
    size = 'default',
  } = props

  const processing = useFormProcessing()
  const isProcessing = processing || processingFromProps

  return (
    <Button
      appearance={appearance}
      className={className}
      disabled={isProcessing || disabled}
      htmlButtonType="submit"
      icon={icon && !isProcessing ? icon : undefined}
      label={isProcessing ? 'Processing...' : label || 'Submit'}
      ref={ref}
      size={size}
    />
  )
})

export default Submit
