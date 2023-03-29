'use client'

import React, { Fragment, useCallback, useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { usePlanSelector } from '@components/PlanSelector'
import { TeamSelector } from '@components/TeamSelector'
import { cloudSlug } from '@root/app/cloud/layout'
import { Plan } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { useGetProject } from '@root/utilities/use-cloud-api'
import useDebounce from '@root/utilities/use-debounce'
import { usePaymentIntent } from '@root/utilities/use-payment-intent'
import { useGitAuthRedirect } from '../authorize/useGitAuthRedirect'
import { EnvVars } from './EnvVars'
import { checkoutReducer, CheckoutState } from './reducer'
import { useDeploy } from './useDeploy'

import classes from './Checkout.module.scss'

type Props = {
  draftProjectID: string
  breadcrumb?: Breadcrumb
}

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

const title = 'Configure your project'

const ConfigureDraftProject: React.FC<Props> = ({ draftProjectID }) => {
  const router = useRouter()
  const { user } = useAuth()

  const [checkoutState, dispatchCheckoutState] = React.useReducer(
    checkoutReducer,
    {} as CheckoutState,
  )

  const [
    InstallationSelector,
    { value: selectedInstall, loading: installsLoading, error: installsError },
  ] = useInstallationSelector()

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

  const { result: project, isLoading } = useGetProject({
    projectID: draftProjectID,
    teamSlug: checkoutState?.team?.slug,
  })

  const { paymentIntent, error: paymentIntentError } = usePaymentIntent({
    project,
    checkoutState,
  })

  useEffect(() => {
    if (project) {
      if (project.status === 'published') {
        router.push(`/${cloudSlug}/${project?.team?.slug}/${project.slug}`)
      } else {
        dispatchCheckoutState({
          type: 'UPDATE_STATE',
          payload: {
            team: project.team,
            plan: project.plan as Plan,
          },
        })
      }
    }
  }, [project, router])

  const { isDeploying, errorDeploying, deploy } = useDeploy({
    projectID: draftProjectID,
    checkoutState,
    installID: selectedInstall?.id.toString(),
    paymentIntent,
  })

  const loading = useDebounce(isLoading, 500)

  const enableTrialSelector = new Date().getTime() < new Date('2023-07-01').getTime()

  // project does not exist
  if (isLoading === false && !project) {
    redirect(`/404`)
  }

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
              {loading || installsLoading ? (
                <LoadingShimmer number={1} />
              ) : (
                <Fragment>
                  <InstallationSelector />
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
                  {checkoutState?.freeTrial && <p>Free trial (ends July 1)</p>}
                </Fragment>
              )}
            </div>
          </Cell>
          <Cell cols={9} colsM={8}>
            {loading || installsLoading ? (
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
                      initialValue: project?.template,
                      value: project?.template,
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
                      {enableTrialSelector && (
                        <div className={classes.freeTrial}>
                          <Checkbox
                            label="Free trial (ends July 1)"
                            checked={checkoutState?.freeTrial}
                            onChange={handleTrialChange}
                            disabled={
                              typeof project?.plan === 'object' &&
                              project?.plan?.slug !== 'standard'
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={classes.projectDetails}>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Ownership</h5>
                      <Link href="">Learn more</Link>
                    </div>
                    <TeamSelector
                      onChange={handleTeamChange}
                      className={classes.teamSelector}
                      initialValue={
                        typeof user?.teams?.[0]?.team !== 'string' ? user?.teams?.[0]?.team?.id : ''
                      }
                    />
                    <Text
                      label="Repository ID"
                      path="repositoryID"
                      disabled
                      description="This only applies to the `import` flow."
                    />
                    <Text
                      label="Template"
                      path="template"
                      disabled
                      description="This only applies to the `clone` flow."
                    />
                  </div>
                  <div className={classes.buildSettings}>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Build Settings</h5>
                      <Link href="">Learn more</Link>
                    </div>
                    <Text label="Project name" path="name" />
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

const Checkout: React.FC<Props> = props => {
  const { breadcrumb } = props

  useAuthRedirect()

  const { tokenLoading } = useGitAuthRedirect()

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
          <h1>{title}</h1>
        </div>
      </Gutter>
      {tokenLoading ? (
        <Gutter>
          <LoadingShimmer number={3} />
        </Gutter>
      ) : (
        <Elements stripe={Stripe}>
          <ConfigureDraftProject {...props} />
        </Elements>
      )}
    </Fragment>
  )
}

export default Checkout
