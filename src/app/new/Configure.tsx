'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { PlanSelector } from '@components/PlanSelector'
import { ScopeSelector } from '@components/ScopeSelector'
import { TeamSelector } from '@components/TeamSelector'
import { Plan, Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { priceFromJSON } from '@root/utilities/price-from-json'
import useDebounce from '@root/utilities/use-debounce'
import { Install } from '@root/utilities/use-get-installs'

import classes from './Configure.module.scss'

const ConfigureDraftProject: React.FC<{
  draftProjectID: string
  breadcrumb?: Breadcrumb
}> = ({ draftProjectID, breadcrumb }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = React.useState<string | ''>()
  const [selectedInstall, setSelectedInstall] = React.useState<Install>()
  const [selectedPlan, setSelectedPlan] = React.useState<Plan>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [project, setProject] = React.useState<Project | null>(null)
  const requestedProject = React.useRef(false)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [submissionError, setSubmissionError] = React.useState<string | null>(null)
  const [isOrgScope, setIsOrgScope] = useState(
    () => selectedInstall?.target_type === 'Organization',
  )

  useEffect(() => {
    if (!requestedProject.current) {
      requestedProject.current = true

      setIsLoading(true)

      const fetchProject = async () => {
        try {
          const req = await fetch(
            `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${draftProjectID}`,
            {
              method: 'GET',
              credentials: 'include',
            },
          )

          const res = await req.json()

          if (req.ok) {
            // eslint-disable-next-line no-underscore-dangle
            if (res._status !== 'draft') {
              router.push(`/dashboard/${res.team?.team?.slug}/${res.slug}`)
            } else {
              setSelectedTeam(res.team?.id)
              setSelectedPlan(res.plan?.id)
              setProject(res)
              setIsLoading(false)
            }
          }
        } catch (error) {
          console.error(error)
          setIsLoading(false)
        }
      }

      fetchProject()
    }
  }, [draftProjectID, router])

  const handleSubmit = useCallback(async () => {
    window.scrollTo(0, 0)

    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const req = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${draftProjectID}`,
        {
          credentials: 'include',
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            _status: 'published',
            team: selectedTeam,
            plan: selectedPlan,
            installID: selectedInstall,
          }),
        },
      )

      const res: Project = await req.json()

      if (req.ok) {
        const team = user.teams.find(({ id }) => id === selectedTeam)?.team
        if (typeof team === 'object') {
          router.push(`/dashboard/${team?.slug}/${res.slug}`)
        }
      } else {
        setIsSubmitting(false)
        // @ts-expect-error
        setSubmissionError(res.errors[0].message)
      }
    } catch (error) {
      console.error(error)
      setSubmissionError(error.message)
      setIsSubmitting(false)
    }
  }, [user, draftProjectID, router, selectedInstall, selectedPlan, selectedTeam])

  useEffect(() => {
    setIsOrgScope(selectedInstall?.target_type === 'Organization')
  }, [selectedInstall])

  const loading = useDebounce(isLoading, 500)

  if (!loading && !project) {
    return <Gutter>This project does not exist.</Gutter>
  }

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
              ...(breadcrumb ? [breadcrumb] : []),
              {
                label: 'Configure',
              },
            ]}
          />
          <h1>Configure your project</h1>
          {submissionError && <p className={classes.error}>{submissionError}</p>}
          {isSubmitting && <p className={classes.submitting}>Submitting...</p>}
        </div>
        {!isSubmitting && (
          <Grid>
            <Cell cols={3} colsM={8} className={classes.sidebarCell}>
              <div className={classes.sidebar}>
                {loading && <LoadingShimmer number={1} />}
                {!loading && (
                  <Fragment>
                    <ScopeSelector
                      onChange={install => {
                        setSelectedInstall(install)
                      }}
                      value={selectedInstall?.id}
                    />
                    <br />
                    <div>
                      <Label label="Total cost" htmlFor="" />
                      <p>{priceFromJSON(selectedPlan?.priceJSON)}</p>
                    </div>
                  </Fragment>
                )}
              </div>
            </Cell>
            <Cell cols={9} colsM={8}>
              {loading && <LoadingShimmer number={3} />}
              {!loading && (
                <Fragment>
                  <div className={classes.details}>
                    <div>
                      <div className={classes.sectionHeader}>
                        <h5 className={classes.sectionTitle}>Select your plan</h5>
                      </div>
                      <div className={classes.plans}>
                        <PlanSelector
                          value={selectedPlan?.id}
                          onChange={setSelectedPlan}
                          isOrgScope={isOrgScope}
                        />
                      </div>
                    </div>
                    <div>
                      <div className={classes.sectionHeader}>
                        <h5 className={classes.sectionTitle}>Ownership</h5>
                        <Link href="">Learn more</Link>
                      </div>
                      <TeamSelector />
                    </div>
                    <div className={classes.buildSettings}>
                      <div className={classes.sectionHeader}>
                        <h5 className={classes.sectionTitle}>Build Settings</h5>
                        <Link href="">Learn more</Link>
                      </div>
                      <Text label="Project name" path="name" initialValue={project?.name} />
                      <Text label="Install Command" path="installCommand" initialValue="yarn" />
                      <Text label="Build Command" path="buildCommand" initialValue="yarn build" />
                      <Text label="Branch to deploy" path="branch" initialValue="main" />
                    </div>
                    <div>
                      <div className={classes.sectionHeader}>
                        <h5 className={classes.sectionTitle}>Environment Variables</h5>
                        <Link href="">Learn more</Link>
                      </div>
                      <div className={classes.envVars}>
                        <Text label="Name" path="environmentVariables[0].name" />
                        <Text label="Value" path="environmentVariables[0].value" />
                      </div>
                      <button
                        className={classes.envAdd}
                        type="button"
                        onClick={() => {
                          // do something
                        }}
                      >
                        Add another
                      </button>
                    </div>
                    <div>
                      <h5>Payment Info</h5>
                    </div>
                    <Button
                      appearance="primary"
                      label="Deploy now"
                      icon="arrow"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    />
                  </div>
                </Fragment>
              )}
            </Cell>
          </Grid>
        )}
      </Gutter>
    </Fragment>
  )
}

export default ConfigureDraftProject
