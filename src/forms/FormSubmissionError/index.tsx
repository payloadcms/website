import { Message } from '@components/Message/index'
import { useForm, useFormProcessing, useFormSubmitted } from '@forms/Form/context'
import React from 'react'

const FormSubmissionError: React.FC<{
  className?: string
  message?: string
}> = (props) => {
  const { className, message } = props

  const { submissionError } = useForm()
  const hasSubmitted = useFormSubmitted()
  const isProcessing = useFormProcessing()

  const messageToUse = message || submissionError

  if (hasSubmitted && submissionError && !isProcessing) {
    return <Message className={className} error={messageToUse} />
  }

  return null
}

export default FormSubmissionError
