'use client'

import React, { Fragment, useCallback, useEffect } from 'react'
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

import { Breadcrumbs } from '@components/Breadcrumbs'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { usePlanSelector } from '@components/PlanSelector'
import { TeamSelector } from '@components/TeamSelector'
import { cloudSlug } from '@root/app/cloud/layout'
import { Plan, Project } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { useGlobals } from '@root/providers/Globals'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { useGetProject } from '@root/utilities/use-cloud-api'
import { usePaymentIntent } from '@root/utilities/use-payment-intent'
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
  const { user } = useAuth()
  const { templates } = useGlobals()

  const isBeta = new Date().getTime() < new Date('2023-07-01').getTime()

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

  const handleTrialChange = useCallback((incomingStatus: boolean) => {
    dispatchCheckoutState({
      type: 'SET_FREE_TRIAL',
      payload: incomingStatus,
    })
  }, [])

  const handleTeamChange = useCallback(
    (incomingTeam: string) => {
      const selectedTeam = user?.teams?.find(team => team.id === incomingTeam)?.team

      if (selectedTeam && typeof selectedTeam !== 'string') {
        dispatchCheckoutState({
          type: 'SET_TEAM',
          payload: selectedTeam,
        })
      }
    },
    [user],
  )

  const [PlanSelector] = usePlanSelector({
    onChange: handlePlanChange,
  })

  const [
    InstallationSelector,
    { value: selectedInstall, loading: installsLoading, error: installsError },
  ] = useInstallationSelector()

  const { paymentIntent, error: paymentIntentError } = usePaymentIntent({
    project,
    checkoutState,
  })

  const onDeploy = useCallback(
    (project: Project) => {
      const redirectURL =
        typeof project?.team === 'object'
          ? `/${cloudSlug}/${project?.team?.slug}/${project.slug}`
          : `/${cloudSlug}`

      router.push(redirectURL)
    },
    [router],
  )

  const { isDeploying, errorDeploying, deploy } = useDeploy({
    onDeploy,
    projectID: draftProjectID,
    checkoutState,
    installID: selectedInstall?.id.toString(),
    paymentIntent,
  })

  const isClone = Boolean(!project?.repositoryID)

  return (
    <Fragment>
      <Gutter>
        <div className={classes.errors}>
          {errorDeploying && <p>{errorDeploying}</p>}
          {installsError && <p>{installsError}</p>}
          {paymentIntentError && <p>{paymentIntentError}</p>}
        </div>
        {isDeploying && <p className={classes.submitting}>Submitting, one moment...</p>}
        <Grid>
          <Cell cols={3} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              {installsLoading ? (
                <LoadingShimmer number={1} />
              ) : (
                <Fragment>
                  <InstallationSelector
                    description={
                      isClone
                        ? `Select where to create this repository.`
                        : `This is the scope of the repository being imported.`
                    }
                  />
                  {checkoutState?.plan && (
                    <div className={classes.totalPriceSection}>
                      <Label label="Total cost" htmlFor="" />
                      <p className={classes.totalPrice}>
                        {priceFromJSON(
                          typeof checkoutState?.plan === 'object' &&
                            'priceJSON' in checkoutState?.plan
                            ? checkoutState?.plan?.priceJSON?.toString()
                            : '',
                        )}
                      </p>
                    </div>
                  )}
                  {checkoutState?.freeTrial && <p>Free during beta—ends July 1st</p>}
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
                  className={classes.details}
                  onSubmit={deploy}
                  initialState={{
                    name: {
                      initialValue: project?.name,
                      value: project?.name,
                    },
                    repositoryID: {
                      initialValue: project?.repositoryID,
                      value: project?.repositoryID,
                    },
                    template: {
                      initialValue:
                        typeof project?.template === 'object' && 'id' in project?.template
                          ? project?.template?.id
                          : project?.template,
                      value:
                        typeof project?.template === 'object' && 'id' in project?.template
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
                    deploymentBranch: {
                      initialValue: project?.deploymentBranch || 'main',
                      value: project?.deploymentBranch || 'main',
                    },
                    environmentVariables: {
                      initialValue: project?.environmentVariables || [{ key: '', value: '' }],
                    },
                  }}
                >
                  <div>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Select your plan</h5>
                    </div>
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
                  <div className={classes.projectDetails}>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Project Settings</h5>
                      <Link href="">Learn more</Link>
                    </div>
                    <Text label="Project name" path="name" />
                    <TeamSelector
                      onChange={handleTeamChange}
                      className={classes.teamSelector}
                      initialValue={
                        typeof project?.team === 'object' && 'id' in project?.team
                          ? project?.team?.id
                          : ''
                      }
                    />
                    {!isClone && (
                      <Text
                        label="Repository ID"
                        path="repositoryID"
                        disabled
                        description="This is the GitHub ID of the repository being imported."
                      />
                    )}
                    {isClone && (
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
                    )}
                  </div>
                  <div className={classes.buildSettings}>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Build Settings</h5>
                      <Link href="">Learn more</Link>
                    </div>
                    <Text label="Install Script" path="installScript" />
                    <Text label="Build Script" path="buildScript" />
                    <Text label="Branch to deploy" path="deploymentBranch" />
                  </div>
                  <div>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Environment Variables</h5>
                      <Link href="">Learn more</Link>
                    </div>
                    <EnvVars className={classes.envVars} />
                  </div>
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
                  <Submit label="Deploy now" />
                </Form>
              </Fragment>
            )}
          </Cell>
        </Grid>
      </Gutter>
    </Fragment>
  )
}

const CheckoutProvider: React.FC<{
  draftProjectID: string
}> = props => {
  const { draftProjectID } = props

  useAuthRedirect()

  const { tokenLoading } = useGitAuthRedirect()

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
          <h1>{title}</h1>
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

export default CheckoutProvider
