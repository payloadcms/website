import React, { useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text/index.js'

import { Spinner } from '@components/Spinner/index.js'
import { CheckIcon } from '@root/icons/CheckIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import useDebounce from '@root/utilities/use-debounce.js'
import { SlugValidationResult, stateReducer } from './reducer.js'

import classes from './index.module.scss'

// checks Payload to ensure that the given slug is unique and ensures only the validated slug is used
// displays a success message if the slug is available, warns the user if the slug is taken
export const UniqueSlug: React.FC<{
  initialValue?: string
  path?: 'slug' | 'createTeamFromSlug'
  collection: 'projects' | 'teams'
  teamID?: string
  label?: string
  docID?: string
  validateOnInit?: boolean
}> = ({
  initialValue,
  collection = 'teams',
  path = 'slug',
  label = 'Slug',
  teamID,
  docID,
  validateOnInit = false,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)

  const [state, dispatchState] = React.useReducer(stateReducer, {
    slug: initialValue || '',
    isUnique: undefined,
    userInteracted: false,
  })

  const debouncedSlug = useDebounce(state.slug, 100)

  const currentSlug = React.useRef(initialValue || '')

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!isRequesting.current && (validateOnInit || state.userInteracted)) {
      isRequesting.current = true

      const slug = currentSlug.current

      if (!slug) {
        setError('Please input a slug')
        dispatchState({ type: 'SET_UNIQUE', payload: false })
        isRequesting.current = false
        return
      }

      if (debouncedSlug) {
        if (debouncedSlug.length < 3) {
          setError('The slug must be at least 3 characters long.')
          dispatchState({ type: 'SET_UNIQUE', payload: false })
          isRequesting.current = false
          return // Exit early to prevent the request from being sent
        }

        const slugRegex = /^[a-zA-Z0-9_-]+$/
        if (!slugRegex.test(debouncedSlug)) {
          setError('The slug can only contain alphanumeric characters, hyphens, and underscores.')
          dispatchState({ type: 'SET_UNIQUE', payload: false })
          isRequesting.current = false
          return // Exit early to prevent the request from being sent
        }

        const validateSlug = async () => {
          // only show loading state if the request is slow
          // this will prevent flickering on fast networks
          timer = setTimeout(() => {
            setIsLoading(true)
          }, 200)

          setError(null)

          try {
            const validityReq = await fetch(
              `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/validate-slug`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  slug: debouncedSlug,
                  collection,
                  team: teamID,
                  id: docID,
                }),
              },
            )

            clearTimeout(timer)

            if (validityReq.ok) {
              const newValidation: SlugValidationResult = await validityReq.json()
              dispatchState({ type: 'RESET', payload: newValidation })
            } else {
              const message =
                validityReq.status === 400
                  ? 'The slug can only contain alphanumeric characters, hyphens, and underscores.'
                  : `Error validating slug: ${validityReq.statusText}`
              console.error(message) // eslint-disable-line no-console
              setError(message)
              dispatchState({ type: 'SET_UNIQUE', payload: false })
            }
          } catch (e) {
            const message = `Error validating slug: ${e.message}`
            console.error(message) // eslint-disable-line no-console
            setError(message)
            dispatchState({ type: 'SET_UNIQUE', payload: false })
          }

          setIsLoading(false)
        }

        validateSlug()
      }

      isRequesting.current = false
    }

    return () => {
      clearTimeout(timer)
    }
  }, [validateOnInit, state.userInteracted, debouncedSlug, collection, teamID, initialValue, docID])

  const validatedSlug = state?.slug
  const slugIsValid = validatedSlug && state?.isUnique
  const slugIsFetched = state?.fetched

  let description
  let isError = Boolean(error || !slugIsValid)

  if (!validateOnInit && !state.userInteracted) {
    description = ''
  } else if (!state.fetched && (validateOnInit || state.userInteracted)) {
    description = 'Checking slug availability...'
  } else if (!currentSlug.current) {
    description = 'Please input a slug'
    isError = true
  } else if (currentSlug.current.length < 3) {
    description = 'The slug must be at least 3 characters long.'
    isError = true
  } else if (error) {
    description = error
  } else if (!slugIsValid) {
    description = `'${currentSlug.current}' is not available. Please choose another.`
  } else if (slugIsValid) {
    description = `'${currentSlug.current}' is available`
  }

  let icon: React.ReactNode = null
  if (isLoading) icon = <Spinner />
  if (slugIsValid) icon = <CheckIcon className={classes.check} size="medium" bold />
  if (slugIsFetched && isError) icon = <CloseIcon className={classes.error} size="medium" bold />

  // two fields are rendered here, the first is controlled, user-facing and not debounced
  // the other is a hidden field that has been validated
  // this field is the only one that is we need sent through the form state
  return (
    <div className={classes.uniqueSlug}>
      <Text
        label={label}
        initialValue={initialValue}
        onChange={newSlug => {
          currentSlug.current = newSlug
          dispatchState({ type: 'SET_SLUG', payload: newSlug })
          dispatchState({ type: 'SET_USER_INTERACTED' })
        }}
        showError={slugIsFetched && isError}
        icon={icon}
        required
      />
      <Text path={path} initialValue={initialValue} value={validatedSlug} required type="hidden" />
      {description && (
        <div
          className={[
            classes.description,
            slugIsFetched && isError && !isLoading && classes.error,
            slugIsValid && !isLoading && classes.success,
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {description}
        </div>
      )}
    </div>
  )
}

export const UniqueTeamSlug: React.FC<{
  teamID?: string
  path?: 'slug' | 'createTeamFromSlug'
  initialValue?: string
}> = props => {
  const { path = 'slug', teamID, initialValue } = props
  return (
    <UniqueSlug
      label="Team Slug"
      path={path}
      collection="teams"
      docID={teamID}
      initialValue={initialValue}
    />
  )
}

export const UniqueProjectSlug: React.FC<{
  teamID?: string
  projectID?: string
  initialValue?: string
  validateOnInit?: boolean
}> = ({ teamID, projectID, initialValue, validateOnInit }) => {
  return (
    <UniqueSlug
      label="Project Slug"
      path="slug"
      collection="projects"
      teamID={teamID}
      docID={projectID}
      initialValue={initialValue}
      validateOnInit={validateOnInit}
    />
  )
}
