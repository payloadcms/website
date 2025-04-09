'use client'

import type { ButtonProps } from '@components/Button/index'

import { Button } from '@components/Button/index'
import { useFormProcessing } from '@forms/Form/context'
import React, { forwardRef } from 'react'

type SubmitProps = {
  iconSize?: 'large' | 'medium' | 'small' | undefined
  label?: null | string
  processing?: boolean
} & ButtonProps

const Submit = ({
  ref,
  ...props
}: { ref?: React.RefObject<HTMLButtonElement | null> } & SubmitProps) => {
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
}

export default Submit
