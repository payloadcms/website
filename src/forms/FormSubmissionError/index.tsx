import React from 'react'
import { useForm, useFormProcessing, useFormSubmitted } from '@forms/Form/context'

import classes from './index.module.scss'

const FormSubmissionError: React.FC<{
  className?: string
  message?: string
  margin?: boolean
}> = props => {
  const { className, message, margin } = props

  const { submissionError } = useForm()
  const hasSubmitted = useFormSubmitted()
  const isProcessing = useFormProcessing()

  if (hasSubmitted && submissionError && !isProcessing) {
    return (
      <p
        className={[className, classes.formSubmissionError, margin === false && classes.noMargin]
          .filter(Boolean)
          .join(' ')}
      >
        {message || submissionError}
      </p>
    )
  }

  return null
}

export default FormSubmissionError
