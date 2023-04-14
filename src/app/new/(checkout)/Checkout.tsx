'use client'

import React, { Fragment, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'

import { BranchSelector } from '@components/BranchSelector'
import { Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { usePlanSelector } from '@components/PlanSelector'
import { TeamSelector } from '@components/TeamSelector'
import { UniqueRepoName } from '@components/UniqueRepoName'
import { cloudSlug } from '@root/app/cloud/client_layout'
import { Plan, Project, Team } from '@root/payload-cloud-types'
import { useGlobals } from '@root/providers/Globals'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { useGetProject } from '@root/utilities/use-cloud-api'
import { useGitAuthRedirect } from '../authorize/useGitAuthRedirect'
import { EnvVars } from './EnvVars'
import { checkoutReducer, CheckoutState } from './reducer'
import { useDeploy } from './useDeploy'

import classes from './Checkout.module.scss'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

const title = 'Configure your project'

// `checkoutState` is external from form state,
// this is bc we need to make a new payment intent each time it's values change
// and _not_ when the form values change
// this is to avoid making more Stripe records than necessary
// a new one is needed each time the plan (including trial), card, or team changes
const Checkout: React.FC<{
  project: Project
  draftProjectID: string
}> = props => {
  const { project, draftProjectID } = props

  const router = useRouter()
  const { templates } = useGlobals()

  const isBeta = new Date().getTime() < new Date('2023-07-01').getTime()
  const [deleting, setDeleting] = React.useState(false)
  const [errorDeleting, setErrorDeleting] = React.useState('')

  const [checkoutState, dispatchCheckoutState] = React.useReducer(checkoutReducer, {
    plan: project?.plan,
    team: project?.team,
    freeTrial: isBeta,
    paymentMethod: '',
  } as CheckoutState)

  const handleCardChange = useCallback((incomingPaymentMethod: string) => {
    dispatchCheckoutState({
      type: 'SET_PAYMENT_METHOD',
      payload: incomingPaymentMethod,
    })
  }, [])

  const handlePlanChange = useCallback((incomingPlan: Plan) => {
    dispatchCheckoutState({
      type: 'SET_PLAN',
      payload: incomingPlan,
    })
  }, [])

  const handleTeamChange = useCallback((incomingTeam: Team) => {
    if (incomingTeam) {
      dispatchCheckoutState({
        type: 'SET_TEAM',
        payload: incomingTeam,
      })
    }
  }, [])

  const [PlanSelector] = usePlanSelector({
    onChange: handlePlanChange,
  })

  const [
    InstallationSelector,
    { value: selectedInstall, loading: installsLoading, error: installsError },
  ] = useInstallationSelector({ initialInstallID: project?.installID })

  const onDeploy = useCallback(
    (project: Project) => {
      const redirectURL =
        typeof project?.team === 'object' && project?.team !== null
          ? `/${cloudSlug}/${project?.team?.slug}/${project.slug}`
          : `/${cloudSlug}`

      router.push(redirectURL)
      toast.success('Thank you! Your project is now being configured.')
    },
    [router],
  )

  const { isDeploying, errorDeploying, deploy } = useDeploy({
    onDeploy,
    project,
    checkoutState,
    installID: selectedInstall?.id.toString() || project?.installID,
  })

  const deleteProject = useCallback(async () => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    setDeleting(true)
    setErrorDeleting('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${draftProjectID}`,
        {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      if (response.ok) {
        router.push(`/${cloudSlug}`)
        toast.success('Draft project cancelled successfully.')
      } else {
        setDeleting(false)
        setErrorDeleting('There was an error deleting your project.')
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      setDeleting(false)
      setErrorDeleting(`There was an error deleting your project: ${error?.message || 'Unknown'}`)
    }
  }, [draftProjectID, router])

  const isClone = Boolean(!project?.repositoryID)

  return (
    <Fragment>
      <Gutter>
        <div className={classes.errors}>
          {errorDeploying && <p>{errorDeploying}</p>}
          {installsError && <p>{installsError}</p>}
          {errorDeleting && <p>{errorDeleting}</p>}
        </div>
        {isDeploying && <p className={classes.submitting}>Submitting, one moment...</p>}
        {deleting && <p className={classes.submitting}>Deleting draft project, one moment...</p>}
        <Grid>
          <Cell cols={3} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              {installsLoading ? (
                <LoadingShimmer number={1} />
              ) : (
                <Fragment>
                  {isClone && (
                    <InstallationSelector description={`Select where to create this repository.`} />
                  )}
                  {!isClone && (
                    <div>
                      <Text label="Repository" value={project?.repositoryFullName} disabled />
                    </div>
                  )}
                  {checkoutState?.plan && (
                    <div className={classes.totalPriceSection}>
                      <Label label="Total cost" htmlFor="" />
                      <p className={classes.totalPrice}>
                        {priceFromJSON(
                          typeof checkoutState?.plan === 'object' &&
                            checkoutState?.plan !== null &&
                            'priceJSON' in checkoutState?.plan
                            ? checkoutState?.plan?.priceJSON?.toString()
                            : '',
                        )}
                      </p>
                      {checkoutState?.freeTrial && <p>Free during beta—ends July 1st</p>}
                    </div>
                  )}
                  <Button
                    onClick={deleteProject}
                    label="Cancel"
                    appearance="text"
                    className={classes.cancel}
                  />
                </Fragment>
              )}
            </div>
          </Cell>
          <Cell cols={9} colsM={8}>
            {installsLoading ? (
              <LoadingShimmer number={3} />
            ) : (
              <Fragment>
                <Form
                  onSubmit={deploy}
                  initialState={{
                    name: {
                      initialValue: project?.name,
                      value: project?.name,
                    },
                    template: {
                      initialValue:
                        typeof project?.template === 'object' &&
                        project?.template !== null &&
                        'id' in project?.template
                          ? project?.template?.id
                          : project?.template,
                      value:
                        typeof project?.template === 'object' &&
                        project?.template !== null &&
                        'id' in project?.template
                          ? project?.template?.id
                          : project?.template,
                    },
                    installScript: {
                      initialValue: project?.installScript || 'yarn',
                      value: project?.installScript || 'yarn',
                    },
                    buildScript: {
                      initialValue: project?.buildScript || 'yarn build',
                      value: project?.buildScript || 'yarn build',
                    },
                    runScript: {
                      initialValue: project?.runScript || 'yarn serve',
                      value: project?.runScript || 'yarn serve',
                    },
                    environmentVariables: {
                      initialValue: project?.environmentVariables || [],
                    },
                    agreeToTerms: {
                      initialValue: false,
                      value: false,
                      valid: false,
                      errorMessage:
                        'You must agree to the terms of service to deploy your project.',
                    },
                    makePrivate: {
                      initialValue: project?.makePrivate || false,
                      value: project?.makePrivate || false,
                    },
                  }}
                >
                  <div>
                    <Heading element="h5" marginTop={false}>
                      Select your plan
                    </Heading>
                    <div className={classes.plans}>
                      <PlanSelector />
                      {isBeta && (
                        <p className={classes.trialDescription}>
                          All plans are free during beta. You will not be charged until after July
                          1st. You can cancel anytime.
                        </p>
                      )}
                    </div>
                  </div>
                  <hr className={classes.hr} />
                  <div className={classes.projectDetails}>
                    <Heading element="h5" marginTop={false} marginBottom={false}>
                      Project Details
                    </Heading>
                    <Select
                      label="Region"
                      path="region"
                      initialValue="us-east"
                      options={[
                        {
                          label: 'US East',
                          value: 'us-east',
                        },
                        {
                          label: 'US West',
                          value: 'us-west',
                        },
                        {
                          label: 'EU West',
                          value: 'eu-west',
                        },
                      ]}
                    />
                    <Text label="Project name" path="name" />
                    <TeamSelector
                      onChange={handleTeamChange}
                      className={classes.teamSelector}
                      initialValue={
                        typeof project?.team === 'object' &&
                        project?.team !== null &&
                        'id' in project?.team
                          ? project?.team?.id
                          : ''
                      }
                    />
                    {isClone && (
                      <Fragment>
                        <Select
                          label="Template"
                          path="template"
                          disabled={Boolean(project?.repositoryID)}
                          options={[
                            { label: 'None', value: '' },
                            ...(templates || [])?.map(template => ({
                              label: template.name || '',
                              value: template.id,
                            })),
                          ]}
                        />
                        <UniqueRepoName
                          repositoryOwner={selectedInstall?.account?.login}
                          initialValue={project?.repositoryName}
                        />
                        <Checkbox path="makePrivate" label="Create private Git repository" />
                      </Fragment>
                    )}
                  </div>
                  <hr className={classes.hr} />
                  <div className={classes.buildSettings}>
                    <Heading element="h5" marginTop={false} marginBottom={false}>
                      Build Settings
                    </Heading>
                    <Text label="Install Command" path="installScript" />
                    <Text label="Build Command" path="buildScript" />
                    <Text label="Serve Command" path="runScript" />
                    <BranchSelector
                      repositoryFullName={project?.repositoryFullName}
                      initialValue={project?.deploymentBranch}
                    />
                  </div>
                  <hr className={classes.hr} />
                  <EnvVars className={classes.envVars} />
                  <hr className={classes.hr} />
                  <div>
                    <h5>Payment Info</h5>
                    {checkoutState?.team && (
                      <CreditCardSelector
                        initialValue={checkoutState?.paymentMethod}
                        team={checkoutState?.team}
                        onChange={handleCardChange}
                      />
                    )}
                  </div>
                  <hr className={classes.hr} />
                  <Checkbox
                    path="agreeToTerms"
                    label={
                      <Fragment>
                        {'I agree to the '}
                        <Link href="/cloud-terms" target="_blank">
                          Terms of Service
                        </Link>
                      </Fragment>
                    }
                    required
                    className={classes.agreeToTerms}
                  />
                  <div className={classes.submit}>
                    <Submit label="Deploy now" />
                  </div>
                </Form>
              </Fragment>
            )}
          </Cell>
        </Grid>
      </Gutter>
    </Fragment>
  )
}

// The `CheckoutProvider`
// 1. verifies GitHub authorization
// 2. initializes Stripe Elements provider
// 3. Loads the initial Payload project
// 4. handles 404s and redirects
// 5. simplifies initial state and loading
const CheckoutProvider: React.FC<{
  draftProjectID: string
  tokenLoading: boolean
}> = props => {
  const { draftProjectID, tokenLoading } = props

  const { result: project, isLoading: projectLoading } = useGetProject({
    projectID: draftProjectID,
  })

  if (projectLoading === false && !project) {
    redirect('/404')
  }

  if (projectLoading === false && project?.status === 'published') {
    redirect(`/${cloudSlug}/${project?.team?.slug}/${project.slug}`)
  }

  const isClone = Boolean(!project?.repositoryID)

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
              ...(isClone
                ? [{ label: 'Template', url: '/new/clone' }]
                : [
                    {
                      label: 'Import',
                      url: '/new/import',
                    },
                  ]),
              {
                label: 'Configure',
              },
            ]}
          />
          <Heading element="h1" marginTop={false}>
            {title}
          </Heading>
        </div>
      </Gutter>
      {tokenLoading || projectLoading ? (
        <Gutter>
          <LoadingShimmer number={3} />
        </Gutter>
      ) : (
        <Elements stripe={Stripe}>
          <Checkout project={project} draftProjectID={draftProjectID} />
        </Elements>
      )}
    </Fragment>
  )
}

// We need to memoize the `CheckoutProvider` so that it doesn't re-render
// when the user object changes. This happens after creating a new team
// during checkout, for instance, where the entire view would be re-rendered.
// Both the `useAuthRedirect` and `useGitAuthRedirect  hooks depend on the `user` object
// so those both should be called here, before the memoization.
const CheckoutAuthentication: React.FC<{
  draftProjectID: string
}> = ({ draftProjectID }) => {
  useAuthRedirect()
  const { tokenLoading } = useGitAuthRedirect()

  const memoizedCheckoutProvider = useMemo(() => {
    return <CheckoutProvider draftProjectID={draftProjectID} tokenLoading={tokenLoading} />
  }, [draftProjectID, tokenLoading])

  return memoizedCheckoutProvider
}

export default CheckoutAuthentication
