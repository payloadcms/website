'use client'

import React, { Fragment, useEffect } from 'react'

// import { useSearchParams } from 'next/navigation'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { Gutter } from '@components/Gutter'
import { useAuth } from '@root/providers/Auth'
import { useExchangeCode } from '../useExchangeCode'
import { Authorize } from './Authorize'
import { CreateProjectFromImport } from './CreateProject'
import { Repo } from './types'

import classes from './index.module.scss'

const ProjectFromImport: React.FC = () => {
  // const params = useSearchParams()
  const { user } = useAuth()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')
  const hasInitializedRepos = React.useRef(false)
  const [repos, setRepos] = React.useState<Repo[]>()

  const { error: exchangeError, hasExchangedCode } = useExchangeCode()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // run this when the user initially logs in and also when they exchange the code
    // this is because the initial response may be a 401 if the user has not authorized
    // in this scenario we want to show the `Authorize` component
    // this component will redirect them to GitHub then back to this page with a `code` param
    // the `useExchangeCode` hook will then exchange the code for an access token
    // once the access token is received we can fetch the user's repos once again
    if (user && (!hasInitializedRepos.current || hasExchangedCode)) {
      hasInitializedRepos.current = true

      timeout = setTimeout(() => {
        setLoading(true)
      }, 250)

      const getRepos = async () => {
        const reposReq = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/users/repositories`,
          {
            method: 'GET',
            credentials: 'include',
          },
        )

        const res = await reposReq.json()

        if (reposReq.ok) {
          setRepos(res.data)
          setError(undefined)
        } else {
          setError(res.error)
        }

        clearTimeout(timeout)
        setLoading(false)
      }

      getRepos()
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [user, hasExchangedCode])

  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <Breadcrumbs
            items={[
              {
                label: 'New',
                url: '/new',
              },
              {
                label: 'Import',
              },
            ]}
          />
          <h1>Import a codebase</h1>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {exchangeError && <p>{exchangeError}</p>}
      </Gutter>
      {!loading && error && <Authorize />}
      {!loading && !error && <CreateProjectFromImport initialRepos={repos} />}
    </Fragment>
  )
}

export default ProjectFromImport
