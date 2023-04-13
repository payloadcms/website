import React, { useEffect } from 'react'
import { Text } from '@forms/fields/Text'

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
  const isRequesting = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isValid, setIsValid] = React.useState<boolean | undefined>(undefined)

  useEffect(() => {
    if (debouncedValue && !isRequesting.current) {
      isRequesting.current = true

      const doFetch = async () => {
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

          if (!validityReq.ok) {
            const message = `Error validating slug: ${validityReq.statusText}`
            console.error(message) // eslint-disable-line no-console
            setError(message)
            setIsValid(false)
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
        }
      }
      doFetch()
    }
  }, [debouncedValue, collection, teamID, initialValue, id])

  return (
    <div>
      <div className={classes.fieldState}>
        {error && <p className={classes.error}>{error}</p>}
        {value && isValid === false && (
          <p className={classes.error}>This slug is taken. Please try another.</p>
        )}
        {value && isValid && <p className={classes.success}>Slug is valid</p>}
      </div>
      <Text
        label={label}
        path={path}
        initialValue={initialValue}
        value={value}
        onChange={setValue}
        description="This value must be unique."
        required
      />
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
