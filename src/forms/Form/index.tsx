'use client'

import React, { useEffect, useRef, useState, useCallback, useReducer, ChangeEvent } from 'react'
import reduceFieldsToValues from './reduceFieldsToValues'
import reducer from './reducer'
import initialContext from './initialContext'

import {
  FormSubmittedContext,
  ProcessingContext,
  ModifiedContext,
  FormContext,
  FieldContext,
} from './context'

import { IFormContext, Field, OnSubmit, InitialState, Data } from '../types'

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
        await onSubmit(reduceFieldsToValues(fields, false), reduceFieldsToValues(fields, true))
      }

      setHasSubmitted(false)
      setIsProcessing(false)
      setIsModified(false)
      return false
    },
    [fields, onSubmit, isProcessing],
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
