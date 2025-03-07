import { useFormProcessing } from '@forms/Form/context'
import useDebounce from '@root/utilities/use-debounce'
import React from 'react'

const FormProcessing: React.FC<{
  className?: string
  delay?: number
  message?: string
}> = (props) => {
  const { className, delay = 250, message = 'Processing...' } = props

  const isProcessing = useFormProcessing()
  const debouncedIsProcessing = useDebounce(isProcessing, delay || 0)

  if (debouncedIsProcessing) {
    return <p className={[className].filter(Boolean).join(' ')}>{message}</p>
  }

  return null
}

export default FormProcessing
