'use client'

import React, { Fragment, useCallback, useEffect } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { usePlanSelector } from '@components/PlanSelector'
import { useScopeSelector } from '@components/ScopeSelector'
import { TeamSelector } from '@components/TeamSelector'
import { Plan, Team } from '@root/payload-types copy'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import useDebounce from '@root/utilities/use-debounce'
import { usePaymentIntent } from '@root/utilities/use-payment-intent'
import { checkoutReducer, CheckoutState } from './reducer'
import { useDeploy } from './useDeploy'

import classes from './Checkout.module.scss'

type Props = {
  draftProjectID: string
  breadcrumb?: Breadcrumb
}

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

const ConfigureDraftProject: React.FC<Props> = ({ draftProjectID, breadcrumb }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [checkoutState, dispatchCheckoutState] = React.useReducer(
    checkoutReducer,
    {} as CheckoutState,
  )
  const requestedProject = React.useRef(false)

  const [
    ScopeSelector,
    { value: selectedInstall, loading: installsLoading, error: installsError },
  ] = useScopeSelector()

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

  const [PlanSelector] = usePlanSelector({
    onChange: handlePlanChange,
  })

  const { paymentIntent, error: paymentIntentError } = usePaymentIntent(checkoutState)

  useEffect(() => {
    if (requestedProject.current) return
    requestedProject.current = true

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
          if (res.status === 'published') {
            router.push(`/dashboard/${res?.team?.slug}/${res.slug}`)
          } else {
            dispatchCheckoutState({
              type: 'SET_PROJECT',
              payload: {
                ...res,
                team: res.team as Team,
                plan: res.plan as Plan,
              },
            })
            setIsLoading(false)
          }
        }
      } catch (err: unknown) {
        console.error(err)
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [draftProjectID, router])

  const { isDeploying, errorDeploying, deploy } = useDeploy({
    checkoutState,
    installID: selectedInstall?.id.toString(),
    paymentIntent,
  })

  const loading = useDebounce(isLoading, 500)

  if (!loading && !checkoutState?.project) {
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
                  <ScopeSelector />
                  <div className={classes.totalPriceSection}>
                    <Label label="Total cost" htmlFor="" />
                    <p className={classes.totalPrice}>
                      {priceFromJSON(
                        typeof checkoutState?.project?.plan !== 'string'
                          ? checkoutState?.project?.plan?.priceJSON
                          : '',
                      )}
                    </p>
                    {checkoutState?.freeTrial && <p>(Free for 7 days)</p>}
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
                <div className={classes.details}>
                  <div>
                    <div className={classes.sectionHeader}>
                      <h5 className={classes.sectionTitle}>Select your plan</h5>
                    </div>
                    <div className={classes.plans}>
                      <PlanSelector />
                      <div className={classes.freeTrial}>
                        <Checkbox
                          label="7 day free trial"
                          checked={checkoutState?.freeTrial}
                          onChange={handleTrialChange}
                          disabled={
                            typeof checkoutState?.project?.plan === 'object' &&
                            checkoutState?.project?.plan?.slug !== 'standard'
                          }
                        />
                        {typeof checkoutState?.project?.plan === 'object' &&
                          checkoutState?.project?.plan?.slug !== 'standard' && (
                            <p className={classes.freeTrialDisabled}>
                              Free trials are only available on the Standard plan.
                            </p>
                          )}
                      </div>
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
                    <Text
                      label="Project name"
                      path="name"
                      initialValue={checkoutState?.project?.name}
                    />
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
                  {!checkoutState?.freeTrial && (
                    <div>
                      <h5>Payment Info</h5>
                      <CreditCardSelector
                        initialValue={checkoutState?.paymentMethod}
                        team={checkoutState?.project?.team as Team}
                        onChange={handleCardChange}
                      />
                    </div>
                  )}
                  <Button
                    appearance="primary"
                    label="Deploy now"
                    icon="arrow"
                    onClick={deploy}
                    disabled={isDeploying}
                  />
                </div>
              </Fragment>
            )}
          </Cell>
        </Grid>
      </Gutter>
    </Fragment>
  )
}

const Checkout: React.FC<Props> = props => {
  useAuthRedirect()

  return (
    <Elements stripe={Stripe}>
      <ConfigureDraftProject {...props} />
    </Elements>
  )
}

export default Checkout
