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

  const { error: exchangeError } = useExchangeCode()

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (user && !hasInitializedRepos.current) {
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
  }, [user])

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
