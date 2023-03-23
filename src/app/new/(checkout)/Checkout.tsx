'use client'

import React, { Fragment, useCallback, useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { usePlanSelector } from '@components/PlanSelector'
import { TeamSelector } from '@components/TeamSelector'
import { Checkbox } from '@forms/fields/Checkbox'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import Label from '@forms/Label'
import { cloudSlug } from '@root/app/cloud/layout'
import { Plan, Team } from '@root/payload-cloud-types'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import { useGetProject } from '@root/utilities/use-cloud'
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

  const handleTeamChange = useCallback((incomingTeam: Team) => {
    dispatchCheckoutState({
      type: 'SET_TEAM',
      payload: incomingTeam,
    })
  }, [])

  const [PlanSelector] = usePlanSelector({
    onChange: handlePlanChange,
  })

  const { paymentIntent, error: paymentIntentError } = usePaymentIntent(checkoutState)

  const {
    result: [project],
    isLoading,
  } = useGetProject({
    projectID: draftProjectID,
    teamSlug: checkoutState?.project?.team?.slug,
  })

  useEffect(() => {
    if (project) {
      if (project.status === 'published') {
        router.push(`/${cloudSlug}/${project?.team?.slug}/${project.slug}`)
      } else {
        dispatchCheckoutState({
          type: 'SET_PROJECT',
          payload: {
            ...project,
            team: project.team as Team,
            plan: project.plan as Plan,
          },
        })
      }
    }
  }, [project, router])

  const { isDeploying, errorDeploying, deploy } = useDeploy({
    checkoutState,
    installID: selectedInstall?.id.toString(),
    paymentIntent,
  })

  const loading = useDebounce(isLoading, 500)

  if (!loading && !checkoutState?.project) {
    return <Gutter>This project does not exist.</Gutter>
  }

  const enableTrialSelector = new Date().getTime() < new Date('2023-07-01').getTime()

  return (
    <Fragment>
      <Gutter>
        <div>
          {errorDeploying && <p className={classes.error}>{errorDeploying}</p>}
          {installsError && <p className={classes.error}>{installsError}</p>}
          {paymentIntentError && <p className={classes.error}>{paymentIntentError}</p>}
          {isDeploying && <p className={classes.submitting}>Submitting, one moment...</p>}
        </div>
        <Grid>
          <Cell cols={3} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              {loading || installsLoading ? (
                <LoadingShimmer number={1} />
              ) : (
                <Fragment>
                  <InstallationSelector />
                  <div className={classes.totalPriceSection}>
                    <Label label="Total cost" htmlFor="" />
                    <p className={classes.totalPrice}>
                      {priceFromJSON(
                        typeof checkoutState?.project?.plan !== 'string'
                          ? checkoutState?.project?.plan?.priceJSON
                          : '',
                      )}
                    </p>
                    {checkoutState?.freeTrial && <p>Free trial (ends July 1)</p>}
                  </div>
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
                    },
                    repositoryURL: {
                      initialValue: project?.repositoryURL,
                    },
                    template: {
                      initialValue: project?.template,
                    },
                    installScript: {
                      initialValue: project?.installScript || 'yarn',
                    },
                    buildScript: {
                      initialValue: project?.buildScript || 'yarn build',
                    },
                    deploymentBranch: {
                      initialValue: project?.deploymentBranch || 'main',
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
                              typeof checkoutState?.project?.plan === 'object' &&
                              checkoutState?.project?.plan?.slug !== 'standard'
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Ownership</h5>
                      <Link href="">Learn more</Link>
                    </div>
                    <TeamSelector onChange={handleTeamChange} className={classes.teamSelector} />
                    <Text
                      label="Repository URL"
                      path="repositoryURL"
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
                    <CreditCardSelector
                      initialValue={checkoutState?.paymentMethod}
                      team={checkoutState?.project?.team as Team}
                      onChange={handleCardChange}
                    />
                  </div>
                  <Button
                    appearance="primary"
                    label="Deploy now"
                    icon="arrow"
                    onClick={deploy}
                    disabled={isDeploying}
                  />
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
