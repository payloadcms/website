import React from 'react'
import { useFormProcessing } from '@forms/Form/context'

import useDebounce from '@root/utilities/use-debounce'

const FormProcessing: React.FC<{
  className?: string
  message?: string
  delay?: number
}> = props => {
  const { className, message = 'Processing...', delay = 150 } = props

  const isProcessing = useFormProcessing()
  const debouncedIsProcessing = useDebounce(isProcessing, delay || 0)

  if (debouncedIsProcessing) {
    return <p className={[className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default FormProcessing
