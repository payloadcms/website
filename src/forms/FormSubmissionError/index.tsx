import React from 'react'
import { useForm, useFormProcessing, useFormSubmitted } from '@forms/Form/context'

import { Banner } from '@components/Banner'

import classes from './index.module.scss'

const FormSubmissionError: React.FC<{
  className?: string
  message?: string
  margin?: boolean
  banner?: boolean
}> = props => {
  const { className, message, margin, banner } = props

  const { submissionError } = useForm()
  const hasSubmitted = useFormSubmitted()
  const isProcessing = useFormProcessing()

  const messageToUse = message || submissionError

  if (hasSubmitted && submissionError && !isProcessing) {
    if (banner) {
      return <Banner type="error">{messageToUse}</Banner>
    }

    return (
      <p
        className={[className, classes.formSubmissionError, margin === false && classes.noMargin]
          .filter(Boolean)
          .join(' ')}
      >
        {messageToUse}
      </p>
    )
  }

  return null
}

export default FormSubmissionError
