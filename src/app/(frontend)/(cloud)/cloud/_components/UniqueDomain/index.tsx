import type { Project, Team } from '@root/payload-cloud-types'

import { Spinner } from '@components/Spinner/index'
import { Text } from '@forms/fields/Text/index'
import { CheckIcon } from '@root/icons/CheckIcon/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import useDebounce from '@root/utilities/use-debounce'
import React, { useEffect, useRef, useState } from 'react'

import type { ValidatedDomainResult } from './reducer'

import classes from './index.module.scss'
import { validatedDomainReducer } from './reducer'

// checks Payload to ensure that the given domain is unique and ensures only the validated domain is used
// displays a success message if the domain is available, warns the user if the domain is taken
// `initialValue` includes the `.payloadcms.app` suffix, so we need to strip that off
export const UniqueDomain: React.FC<{
  id: string | undefined
  initialValue: Project['defaultDomain']
  label?: string
  path?: 'defaultDomain'
  team: Team
}> = ({ id, initialValue, label = 'Default domain', path = 'defaultDomain', team }) => {
  const initialSubdomain = useRef<string | undefined>(initialValue?.replace('.payloadcms.app', ''))

  const [value, setValue] = React.useState<string | undefined>(initialSubdomain.current)

  const prevValue = React.useRef<string | undefined>(undefined)
  const debouncedValue = useDebounce(value, 100)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const isRequesting = React.useRef(false)
  const [error, setError] = React.useState<null | string>(null)

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
              body: JSON.stringify({
                id,
                subdomain: debouncedValue,
              }),
              headers: {
                'Content-Type': 'application/json',
              },
              method: 'POST',
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
  if (isLoading) {
    icon = <Spinner />
  }
  if (domainIsValid) {
    icon = <CheckIcon bold className={classes.check} size="medium" />
  }
  if (error || !domainIsValid) {
    icon = <CloseIcon bold className={classes.error} size="medium" />
  }

  // two fields are rendered here, the first is controlled, user-facing and not debounced
  // the other is a hidden field that has been validated
  // this field is the only one that is we need sent through the form state
  return (
    <div className={classes.uniqueDomain}>
      <Text
        className={classes.input}
        icon={icon}
        initialValue={initialSubdomain.current}
        label={label}
        onChange={setValue}
        required
        showError={Boolean(error || !domainIsValid)}
        suffix=".payloadcms.app"
      />
      <Text path={path} required type="hidden" value={theValidatedDomain} />
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
