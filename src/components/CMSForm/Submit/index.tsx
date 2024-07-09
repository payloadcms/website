'use client'

import React, { forwardRef } from 'react'
import { useFormProcessing } from '@forms/Form/context.js'

import { Button, ButtonProps } from '@components/Button/index.js'

type SubmitProps = ButtonProps & {
  label?: string | null
  processing?: boolean
  iconSize?: 'large' | 'medium' | 'small' | undefined
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    label,
    processing: processingFromProps,
    className,
    appearance = 'default',
    size = 'default',
    icon = 'arrow',
    disabled,
    iconRotation,
    iconSize,
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
      iconRotation={iconRotation}
      label={isProcessing ? 'Processing...' : label || 'Submit'}
      className={className}
      disabled={isProcessing || disabled}
      fullWidth
      hideHorizontalBorders
      isCMSFormSubmitButton
      iconSize={iconSize}
    />
  )
})

export default Submit
