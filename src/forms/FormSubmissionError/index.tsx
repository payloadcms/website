import React from 'react'
import { useForm, useFormModified, useFormSubmitted } from '@forms/Form/context'

import classes from './index.module.scss'

const FormSubmissionError: React.FC<{
  className?: string
  message?: string
}> = props => {
  const { className, message } = props

  const { submissionError } = useForm()
  const hasSubmitted = useFormSubmitted()
  const isModified = useFormModified()

  if (hasSubmitted && !isModified && submissionError) {
    return (
      <p className={[className, classes.formSubmissionError].filter(Boolean).join(' ')}>
        {message || submissionError}
      </p>
    )
  }

  return null
}

export default FormSubmissionError
