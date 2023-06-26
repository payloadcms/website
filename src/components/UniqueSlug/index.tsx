import React, { useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text'

import { Spinner } from '@root/app/_components/Spinner'
import { CheckIcon } from '@root/icons/CheckIcon'
import { CloseIcon } from '@root/icons/CloseIcon'
import useDebounce from '@root/utilities/use-debounce'
import { slugValidationReducer, SlugValidationResult } from './reducer'

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
}> = ({ initialValue, collection = 'teams', path = 'slug', label = 'Slug', teamID, docID }) => {
  const [value, setValue] = React.useState(initialValue)
  const debouncedValue = useDebounce(value, 100)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)

  const [slugValidation, dispatchSlugValidation] = React.useReducer(slugValidationReducer, {
    slug: '',
    isUnique: undefined,
  })

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (!isRequesting.current) {
      isRequesting.current = true

      if (debouncedValue) {
        const validateSlug = async () => {
          // only show loading state if the request is slow
          // this will prevent flickering on fast networks
          timer = setTimeout(() => {
            setIsLoading(true)
          }, 200)

          try {
            const validityReq = await fetch(
              `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/validate-slug`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  slug: debouncedValue,
                  collection,
                  team: teamID,
                  id: docID,
                }),
              },
            )

            clearTimeout(timer)

            if (validityReq.ok) {
              const newValidation: SlugValidationResult = await validityReq.json()
              dispatchSlugValidation({ type: 'RESET', payload: newValidation })
            } else {
              const message = `Error validating slug: ${validityReq.statusText}`
              console.error(message) // eslint-disable-line no-console
              setError(message)
              dispatchSlugValidation({ type: 'SET_UNIQUE', payload: false })
            }
          } catch (e) {
            const message = `Error validating slug: ${e.message}`
            console.error(message) // eslint-disable-line no-console
            setError(message)
            dispatchSlugValidation({ type: 'SET_UNIQUE', payload: false })
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
  }, [debouncedValue, collection, teamID, initialValue, docID])

  const validatedSlug = slugValidation?.slug
  const slugIsValid = validatedSlug && slugValidation?.isUnique
  const slugIsFetched = slugValidation?.fetched

  let description
  let isError = Boolean(error || !slugIsValid)

  if (!slugValidation.fetched) {
    description = 'Fetching slug...'
  } else if (!validatedSlug) {
    description = 'Please input a slug'
    isError = true
  } else if (error) {
    description = error
  } else if (!slugIsValid) {
    description = `'${validatedSlug}' is not available. Please choose another.`
  } else if (slugIsValid) {
    description = `'${validatedSlug}' is available`
  }

  let icon: React.ReactNode = null
  if (isLoading) icon = <Spinner />
  if (slugIsValid) icon = <CheckIcon className={classes.check} size="medium" bold />
  if (slugIsFetched && isError) icon = <CloseIcon className={classes.error} size="medium" bold />

  // two fields are rendered here, the first is controlled, user-facing and not debounced
  // the other is a hidden field that has been validated
  // this field is the only one that is we need sent through the form state
  return (
    <div>
      <Text
        label={label}
        initialValue={initialValue}
        onChange={newSlug => {
          setValue(newSlug)
          dispatchSlugValidation({ type: 'SET_SLUG', payload: newSlug })
        }}
        showError={slugIsFetched && isError}
        icon={icon}
        required
      />
      <Text path={path} initialValue={initialValue} value={validatedSlug} required type="hidden" />
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
}> = ({ teamID, projectID, initialValue }) => {
  return (
    <UniqueSlug
      label="Project Slug"
      path="slug"
      collection="projects"
      teamID={teamID}
      docID={projectID}
      initialValue={initialValue}
    />
  )
}
