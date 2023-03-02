'use client'

import React, { ChangeEvent, useCallback, useEffect, useReducer, useRef, useState } from 'react'

import { Data, Field, IFormContext, InitialState, OnSubmit } from '../types'
import {
  FieldContext,
  FormContext,
  FormSubmittedContext,
  ModifiedContext,
  ProcessingContext,
} from './context'
import initialContext from './initialContext'
import { reduceFieldsToValues } from './reduceFieldsToValues'
import reducer from './reducer'

const defaultInitialState = {}

const Form: React.FC<{
  onSubmit?: OnSubmit
  children: React.ReactNode
  initialState?: InitialState
  method?: 'GET' | 'POST'
  action?: string
  className?: string
}> = props => {
  const {
    onSubmit,
    children,
    initialState = defaultInitialState,
    method,
    action,
    className,
  } = props

  const [fields, dispatchFields] = useReducer(reducer, initialState)
  const [isModified, setIsModified] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const contextRef = useRef<IFormContext>(initialContext)

  contextRef.current.initialState = initialState
  contextRef.current.fields = fields

  const handleSubmit = useCallback(
    async (e: ChangeEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      setHasSubmitted(true)
      setIsProcessing(true)

      const formIsValid = contextRef.current.validateForm()

      if (!formIsValid) {
        e.preventDefault()

        // TODO: wire in notifications
        // setNotification({
        //   id: 'formError',
        //   message: 'Please check your submission and try again.',
        // })

        setIsProcessing(false)
        return false
      }

      if (typeof onSubmit === 'function') {
        await onSubmit({
          data: reduceFieldsToValues(fields, false),
          unflattenedData: reduceFieldsToValues(fields, true),
        })
      }

      setHasSubmitted(false)
      setIsProcessing(false)
      setIsModified(false)
      return false
    },
    [onSubmit, fields, setHasSubmitted, setIsProcessing, setIsModified],
  )

  const getFields = useCallback(() => contextRef.current.fields, [contextRef])

  const getField = useCallback(
    (path: string): Field => {
      return contextRef.current.fields[path]
    },
    [contextRef],
  )

  const getFormData = useCallback((): Data => {
    return reduceFieldsToValues(contextRef.current.fields, true)
  }, [contextRef])

  const validateForm = useCallback((): boolean => {
    return !Object.values(contextRef.current.fields).some((field): boolean => field.valid === false)
  }, [contextRef])

  contextRef.current = {
    ...contextRef.current,
    dispatchFields,
    handleSubmit,
    getFields,
    getField,
    getFormData,
    validateForm,
    setIsModified,
    setIsProcessing,
    setHasSubmitted,
  }

  useEffect(() => {
    contextRef.current = { ...initialContext }
    dispatchFields({
      type: 'REPLACE_STATE',
      state: initialState,
    })
  }, [initialState])

  return (
    <form
      method={method}
      action={action}
      noValidate
      onSubmit={contextRef.current.handleSubmit}
      className={className}
    >
      <FormContext.Provider value={contextRef.current}>
        <FieldContext.Provider
          value={{
            ...contextRef.current,
          }}
        >
          <FormSubmittedContext.Provider value={hasSubmitted}>
            <ProcessingContext.Provider value={isProcessing}>
              <ModifiedContext.Provider value={isModified}>{children}</ModifiedContext.Provider>
            </ProcessingContext.Provider>
          </FormSubmittedContext.Provider>
        </FieldContext.Provider>
      </FormContext.Provider>
    </form>
  )
}

export default Form
