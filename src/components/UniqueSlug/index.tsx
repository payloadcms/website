import React, { useEffect, useState } from 'react'
import { Text } from '@forms/fields/Text'

import { Spinner } from '@root/app/_components/Spinner'
import { Check } from '@root/icons/Check'
import useDebounce from '@root/utilities/use-debounce'

import classes from './index.module.scss'

// checks Payload to ensure that the given slug is unique
// displays a success message if the slug is available
// warns the user if the slug is taken
export const UniqueSlug: React.FC<{
  initialValue?: string
  path?: 'slug' | 'createTeamFromSlug'
  collection: 'projects' | 'teams'
  teamID?: string
  label?: string
  id?: string
}> = ({ initialValue, collection = 'teams', path = 'slug', label = 'Slug', teamID, id }) => {
  const [value, setValue] = React.useState(initialValue)
  const debouncedValue = useDebounce(value, 100)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isValid, setIsValid] = React.useState<boolean | undefined>(undefined)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (debouncedValue && !isRequesting.current) {
      isRequesting.current = true
      setIsValid(undefined)

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
                team: collection === 'projects' ? teamID : undefined,
                id,
              }),
            },
          )

          clearTimeout(timer)

          if (!validityReq.ok) {
            const message = `Error validating slug: ${validityReq.statusText}`
            console.error(message) // eslint-disable-line no-console
            setError(message)
            setIsValid(false)
            setIsLoading(false)
            return
          }

          const { isUnique } = await validityReq.json()
          setIsValid(isUnique)
          isRequesting.current = false
        } catch (e) {
          const message = `Error validating slug: ${e.message}`
          console.error(message) // eslint-disable-line no-console
          setError(message)
          setIsValid(false)
          setIsLoading(false)
        }
      }

      validateSlug()
    }

    return () => {
      clearTimeout(timer)
    }
  }, [debouncedValue, collection, teamID, initialValue, id])

  let description = 'Choose a team slug'
  if (error) description = error
  if (debouncedValue && isValid === false)
    description = `'${debouncedValue}' is not available. Please choose another.`
  if (debouncedValue && isValid) description = `'${debouncedValue}' is available`

  let icon: React.ReactNode = null
  if (isLoading) icon = <Spinner />
  if (isValid) icon = <Check className={classes.check} />

  return (
    <div>
      <Text
        label={label}
        path={path}
        initialValue={initialValue}
        value={value}
        onChange={setValue}
        required
        icon={icon}
        showError={Boolean(error || isValid === false)}
      />
      <div
        className={[
          classes.description,
          (error || isValid === false) && !isLoading && classes.error,
          isValid && !isLoading && classes.success,
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
}> = props => {
  const { path = 'slug', teamID } = props
  return <UniqueSlug label="Team Slug" path={path} collection="teams" id={teamID} />
}

export const UniqueProjectSlug: React.FC<{
  teamID: string
}> = ({ teamID }) => {
  return <UniqueSlug label="Project Slug" path="slug" collection="projects" teamID={teamID} />
}
