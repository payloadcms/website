'use client'

import type { ButtonProps } from '@components/Button/index.js'

import { Button } from '@components/Button/index.js'
import { useFormProcessing } from '@forms/Form/context.js'
import React, { forwardRef } from 'react'

type SubmitProps = ButtonProps & {
  iconSize?: 'large' | 'medium' | 'small' | undefined
  label?: null | string
  processing?: boolean
}

const Submit = forwardRef<HTMLButtonElement, SubmitProps>((props, ref) => {
  const {
    id,
    appearance = 'default',
    className,
    disabled,
    icon = 'arrow',
    iconRotation,
    iconSize,
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
      fullWidth
      hideHorizontalBorders
      htmlButtonType="submit"
      icon={icon && !isProcessing ? icon : undefined}
      iconRotation={iconRotation}
      iconSize={iconSize}
      id={id}
      isCMSFormSubmitButton
      label={isProcessing ? 'Processing...' : label || 'Submit'}
      ref={ref}
      size={size}
    />
  )
})

export default Submit
