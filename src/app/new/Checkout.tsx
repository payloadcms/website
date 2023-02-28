'use client'

import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Text } from '@forms/fields/Text'
import Label from '@forms/Label'
import {
  CardElement as StripeCardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Breadcrumb, Breadcrumbs } from '@components/Breadcrumbs'
import { Button } from '@components/Button'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { PlanSelector } from '@components/PlanSelector'
import { ScopeSelector } from '@components/ScopeSelector'
import { TeamSelector } from '@components/TeamSelector'
import { Plan, Project, Team } from '@root/payload-cloud-types'
import { useAuth } from '@root/providers/Auth'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { useAuthRedirect } from '@root/utilities/use-auth-redirect'
import useDebounce from '@root/utilities/use-debounce'
import { Install } from '@root/utilities/use-get-installs'
import { usePaymentIntent } from '@root/utilities/use-payment-intent'

import classes from './Checkout.module.scss'

type Props = {
  draftProjectID: string
  breadcrumb?: Breadcrumb
}

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

const ConfigureDraftProject: React.FC<Props> = ({ draftProjectID, breadcrumb }) => {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedTeam, setSelectedTeam] = React.useState<Team>()
  const [selectedInstall, setSelectedInstall] = React.useState<Install>()
  const [selectedPlan, setSelectedPlan] = React.useState<Plan>()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [project, setProject] = React.useState<Project | null>(null)
  const requestedProject = React.useRef(false)
  const stripe = useStripe()
  const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null)

  const { clientSecret: stripeClientSecret, error: paymentIntentError } = usePaymentIntent({
    plan: selectedPlan,
    team: selectedTeam,
    paymentMethod,
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const elements = useElements()
  const [isOrgScope, setIsOrgScope] = useState(
    () => selectedInstall?.target_type === 'Organization',
  )

  useEffect(() => {
    if (requestedProject.current) return
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
            router.push(`/dashboard/${res?.team?.slug}/${res.slug}`)
          } else {
            setSelectedTeam(res.team as Team)
            setSelectedPlan(res.plan as Plan)
            setProject(res)
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

  const processPayment = useCallback(async (): Promise<void> => {
    if (selectedPlan.slug === 'free' && !stripeClientSecret) {
      return
    }

    const payload = await stripe.confirmCardPayment(stripeClientSecret, {
      payment_method: paymentMethod || {
        card: elements.getElement(StripeCardElement),
      },
    })

    if (payload.error) {
      throw new Error(payload.error.message)
    }
  }, [stripeClientSecret, elements, stripe, selectedPlan, paymentMethod])

  const handleSubmit = useCallback(async () => {
    window.scrollTo(0, 0)

    setIsSubmitting(true)
    setError(null)

    try {
      // process the payment
      await processPayment()

      // publish the project
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
            team: selectedTeam?.id,
            plan: selectedPlan?.id,
            installID: selectedInstall?.id,
          }),
        },
      )

      const res: {
        doc: Project
        message: string
        errors: { message: string }[]
      } = await req.json()

      if (req.ok) {
        const teamID = typeof selectedTeam === 'string' ? selectedTeam : selectedTeam?.id
        const matchedTeam = user.teams.find(({ team }) => {
          return typeof team === 'string' ? team === teamID : team?.id === teamID
        })?.team

        const redirectURL =
          typeof matchedTeam === 'object'
            ? `/dashboard/${matchedTeam?.slug}/${res.doc.slug}`
            : '/dashboard'

        router.push(redirectURL)
      } else {
        setIsSubmitting(false)
        setError(res.errors[0].message)
      }
    } catch (err: unknown) {
      console.error(err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setIsSubmitting(false)
    }
  }, [user, draftProjectID, router, selectedInstall, selectedPlan, selectedTeam, processPayment])

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
          {error && <p className={classes.error}>{error}</p>}
          {paymentIntentError && <p className={classes.error}>{paymentIntentError}</p>}
          {isSubmitting && <p className={classes.submitting}>Submitting, one moment...</p>}
        </div>
        <Grid>
          <Cell cols={3} colsM={8} className={classes.sidebarCell}>
            <div className={classes.sidebar}>
              {loading ? (
                <LoadingShimmer number={1} />
              ) : (
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
            {loading ? (
              <LoadingShimmer number={3} />
            ) : (
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
                  {selectedPlan?.slug !== 'free' && (
                    <div>
                      <h5>Payment Info</h5>
                      <CreditCardSelector
                        initialValue={paymentMethod}
                        team={selectedTeam}
                        onChange={setPaymentMethod}
                      />
                    </div>
                  )}
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
