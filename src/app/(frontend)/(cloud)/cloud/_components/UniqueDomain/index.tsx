import React, { useEffect, useRef, useState } from 'react'
import { Text } from '@forms/fields/Text/index.js'

import { Spinner } from '@components/Spinner/index.js'
import { CheckIcon } from '@root/icons/CheckIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { Project, Team } from '@root/payload-cloud-types.js'
import useDebounce from '@root/utilities/use-debounce.js'
import { validatedDomainReducer, ValidatedDomainResult } from './reducer.js'

import classes from './index.module.scss'

// checks Payload to ensure that the given domain is unique and ensures only the validated domain is used
// displays a success message if the domain is available, warns the user if the domain is taken
// `initialValue` includes the `.payloadcms.app` suffix, so we need to strip that off
export const UniqueDomain: React.FC<{
  initialValue: Project['defaultDomain']
  team: Team
  path?: 'defaultDomain'
  label?: string
  id: string | undefined
}> = ({ initialValue, label = 'Default domain', id, path = 'defaultDomain', team }) => {
  const initialSubdomain = useRef<string | undefined>(initialValue?.replace('.payloadcms.app', ''))

  const [value, setValue] = React.useState<string | undefined>(initialSubdomain.current)

  const prevValue = React.useRef<string | undefined>(undefined)
  const debouncedValue = useDebounce(value, 100)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = React.useRef(false)
  const [error, setError] = React.useState<string | null>(null)

  const [validatedDomain, dispatchValidatedDomain] = React.useReducer(validatedDomainReducer, {
    domain: '',
    isUnique: undefined,
  })

  useEffect(() => {
    let timer: NodeJS.Timeout

    // since we need this effect to run when the `debouncedValue` is `undefined`
    // we need to use a ref to prevent duplicative requests as this component re-renders
    if (!isRequesting.current && debouncedValue !== prevValue.current) {
      isRequesting.current = true

      const validateDomain = async () => {
        // only show loading state if the request is slow
        // this will prevent flickering on fast networks
        timer = setTimeout(() => {
          setIsLoading(true)
        }, 200)

        try {
          const validityReq = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/validate-subdomain`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                subdomain: debouncedValue,
                id,
              }),
            },
          )

          clearTimeout(timer)

          if (!validityReq.ok) {
            const responseBody = await validityReq.json()

            let errorMessage =
              responseBody?.error || `Error validating domain: ${validityReq.statusText}`

            if (responseBody.error === 'No subdomain provided.') {
              errorMessage = 'Please input a subdomain.'
            }

            console.error(errorMessage) // eslint-disable-line no-console
            setError(errorMessage)
            dispatchValidatedDomain({ type: 'SET_UNIQUE', payload: false })
            setIsLoading(false)
            return
          }

          const newValidation: ValidatedDomainResult = await validityReq.json()
          setError(null)
          dispatchValidatedDomain({ type: 'RESET', payload: newValidation })
        } catch (e) {
          const message = `Error validating domain: ${e.message}`
          console.error(message) // eslint-disable-line no-console
          setError(message)
          dispatchValidatedDomain({ type: 'SET_UNIQUE', payload: false })
          setIsLoading(false)
        }
      }

      validateDomain()
    }

    isRequesting.current = false

    return () => {
      clearTimeout(timer)
    }
  }, [debouncedValue, id])

  const theValidatedDomain = validatedDomain?.domain
  const domainIsValid = validatedDomain && validatedDomain?.isUnique

  let description = 'Choose a domain'

  if (!theValidatedDomain) {
    description = 'Choose a domain'
  } else if (error) {
    description = error
  } else if (!domainIsValid) {
    description = `Domain '${theValidatedDomain}' is not available. Please choose another.`
  } else if (domainIsValid) {
    description = `Domain '${theValidatedDomain}' is available`
  }

  let icon: React.ReactNode = null
  if (isLoading) icon = <Spinner />
  if (domainIsValid) icon = <CheckIcon className={classes.check} size="medium" bold />
  if (error || !domainIsValid) icon = <CloseIcon className={classes.error} size="medium" bold />

  // two fields are rendered here, the first is controlled, user-facing and not debounced
  // the other is a hidden field that has been validated
  // this field is the only one that is we need sent through the form state
  return (
    <div className={classes.uniqueDomain}>
      <Text
        className={classes.input}
        label={label}
        initialValue={initialSubdomain.current}
        onChange={setValue}
        showError={Boolean(error || !domainIsValid)}
        icon={icon}
        suffix=".payloadcms.app"
        required
      />
      <Text path={path} value={theValidatedDomain} required type="hidden" />
      <div
        className={[
          classes.description,
          (error || !domainIsValid) && !isLoading && classes.error,
          domainIsValid && !isLoading && classes.success,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {description}
      </div>
    </div>
  )
}
