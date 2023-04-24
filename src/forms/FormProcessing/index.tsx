import React from 'react'
import { useFormProcessing } from '@forms/Form/context'

const FormProcessing: React.FC<{
  className?: string
  message?: string
}> = props => {
  const { className, message = 'Processing...' } = props

  const isProcessing = useFormProcessing()

  if (isProcessing) {
    return <p className={[className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default FormProcessing
