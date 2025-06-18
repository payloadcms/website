'use client'

import type { Install } from '@cloud/_api/fetchInstalls'
import type { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import type { ProjectDeployResponse } from '@root/app/(frontend)/types'
import type { Plan, Project, Team, Template, User } from '@root/payload-cloud-types'

import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { BranchSelector } from '@cloud/_components/BranchSelector/index'
import { ComparePlans } from '@cloud/_components/ComparePlans/index'
import { CreditCardSelector } from '@cloud/_components/CreditCardSelector/index'
import { PlanSelector } from '@cloud/_components/PlanSelector/index'
import { RepoExists } from '@cloud/_components/RepoExists/index'
import { TeamSelector } from '@cloud/_components/TeamSelector/index'
import { UniqueDomain } from '@cloud/_components/UniqueDomain/index'
import { UniqueProjectSlug } from '@cloud/_components/UniqueSlug/index'
import { cloudSlug } from '@cloud/slug'
import { Accordion } from '@components/Accordion/index'
import { Button } from '@components/Button/index'
import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import { HR } from '@components/HR/index'
import { Message } from '@components/Message/index'
import { Checkbox } from '@forms/fields/Checkbox/index'
import { Select } from '@forms/fields/Select/index'
import { Text } from '@forms/fields/Text/index'
import Form from '@forms/Form/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Label from '@forms/Label/index'
import Submit from '@forms/Submit/index'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe, type PaymentMethod } from '@stripe/stripe-js'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'
import React, { Fragment, useCallback } from 'react'
import { toast } from 'sonner'

import type { CheckoutState } from './reducer'

import { CloneOrDeployProgress } from '../../cloud/_components/CloneOrDeployProgress/index'
import classes from './Checkout.module.scss'
import { deploy } from './deploy'
import { EnvVars } from './EnvVars'
import { checkoutReducer } from './reducer'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const Stripe = loadStripe(apiKey)

const title = 'Configure your project'

// `checkoutState` is external from form state,
// this is bc we need to make a new payment intent each time it's values change
// and _not_ when the form values change
// this is to avoid making more Stripe records than necessary
// a new one is needed each time the plan (including trial), card, or team changes
const Checkout: React.FC<{
  initialPaymentMethods?: null | PaymentMethod[]
  installs: Install[]
  plans: Plan[]
  project: null | Project | undefined
  templates: Template[]
  user: null | undefined | User
}> = (props) => {
  const { initialPaymentMethods, installs, plans, project, templates, user } = props
  const isClone = Boolean(project?.template)
  const stripe = useStripe()
  const elements = useElements()

  const router = useRouter()

  const [deleting, setDeleting] = React.useState(false)
  const [errorDeleting, setErrorDeleting] = React.useState('')

  const [checkoutState, dispatchCheckoutState] = React.useReducer(checkoutReducer, {
    freeTrial: true,
    paymentMethod: '',
    plan: project?.plan,
    team: project?.team,
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
    // TODO: query the team's customer and attach it here
    // just make a simple fetch to `/api/teams/customer` and append it to the team
    const teamWithCustomer = incomingTeam as TeamWithCustomer

    if (incomingTeam) {
      dispatchCheckoutState({
        type: 'SET_TEAM',
        payload: teamWithCustomer,
      })
    }
  }, [])

  const onDeploy = useCallback(
    (project: ProjectDeployResponse) => {
      const redirectURL =
        typeof project?.team === 'object' && project?.team !== null
          ? `/${cloudSlug}/${project?.team?.slug}/${project.slug}`
          : `/${cloudSlug}`

      router.push(redirectURL)
      toast.success('Thank you! Your project is now being configured.')
    },
    [router],
  )

  const deleteProject = useCallback(async () => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)

    setDeleting(true)
    setErrorDeleting('')

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/projects/${project?.id}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'DELETE',
        },
      )

      if (response.ok) {
        await revalidateCache({
          tag: `projects`,
        })

        router.push(`/${cloudSlug}`)

        toast.success('Draft project canceled successfully.')
      } else {
        setDeleting(false)
        setErrorDeleting('There was an error deleting your project.')
      }
    } catch (error) {
      console.error(error) // eslint-disable-line no-console
      setDeleting(false)
      setErrorDeleting(`There was an error deleting your project: ${error?.message || 'Unknown'}`)
    }
  }, [project, router])

  const handleSubmit = useCallback(
    async ({ unflattenedData }) => {
      await deploy({
        checkoutState,
        elements,
        installID: project?.installID,
        onDeploy,
        project,
        router,
        stripe,
        unflattenedData,
        user,
      })
    },
    [checkoutState, onDeploy, project, user, stripe, elements, router],
  )

  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <Heading element="h2">{deleting ? 'Canceling draft project...' : title}</Heading>
        </div>
      </Gutter>
      <Form onSubmit={handleSubmit}>
        <Gutter>
          <div className={classes.formState}>
            <FormSubmissionError />
            {errorDeleting && <Message error={errorDeleting} />}
          </div>
          <div className="grid">
            <div className={['cols-4 cols-m-8', classes.sidebar].join(' ')}>
              <Fragment>
                <div className={classes.installationSelector}>
                  <TeamSelector
                    className={classes.teamSelector}
                    enterpriseOnly={true}
                    initialValue={
                      typeof project?.team === 'object' &&
                      project?.team !== null &&
                      'id' in project?.team
                        ? project?.team?.id
                        : ''
                    }
                    onChange={handleTeamChange}
                    required
                    user={user}
                  />
                </div>
                <div className={classes.totalPriceSection}>
                  <Label htmlFor="" label="Total cost" />
                  <p className={classes.totalPrice}>
                    {priceFromJSON(
                      typeof checkoutState?.plan === 'object' &&
                        checkoutState?.plan !== null &&
                        'priceJSON' in checkoutState?.plan
                        ? checkoutState?.plan?.priceJSON?.toString()
                        : '',
                    )}
                    {checkoutState?.freeTrial && (
                      <Fragment>
                        <br />
                        <span className={classes.trialDescription}>Free for 7 days</span>
                      </Fragment>
                    )}
                  </p>
                </div>
                <Button
                  appearance="text"
                  className={classes.cancel}
                  label="Cancel"
                  onClick={deleteProject}
                />
              </Fragment>
            </div>
            <div className={['cols-12 cols-m-8'].join(' ')}>
              <div className={classes.plansSection}>
                <div className={classes.plansSectionHeader}>
                  <Heading element="h4" marginTop={false}>
                    Select your plan
                  </Heading>
                  <ComparePlans handlePlanChange={handlePlanChange} plans={plans} />
                </div>
                <div className={classes.plans}>
                  <PlanSelector
                    onChange={handlePlanChange}
                    plans={plans}
                    selectedPlan={checkoutState?.plan}
                  />
                </div>
                <Checkbox
                  className={classes.freeTrial}
                  initialValue={checkoutState?.freeTrial}
                  label="Free trial, no credit card required"
                  onChange={(value: boolean) => {
                    dispatchCheckoutState({
                      type: 'SET_FREE_TRIAL',
                      payload: value,
                    })
                  }}
                />
              </div>
              <Heading element="h4" marginTop={false}>
                Configure your project
              </Heading>
              <div className={classes.fields}>
                <Accordion label={<p>Project Details</p>} openOnInit>
                  <div className={classes.projectDetails}>
                    <Select
                      initialValue="us-east"
                      label="Region"
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
                      path="region"
                      required
                    />
                    <Text initialValue={project?.name} label="Project name" path="name" required />
                    <UniqueProjectSlug
                      initialValue={project?.slug}
                      projectID={project?.id}
                      teamID={typeof project?.team === 'string' ? project?.team : project?.team?.id}
                      validateOnInit={true}
                    />
                    {isClone && (
                      <Select
                        disabled
                        initialValue={
                          typeof project?.template === 'object' &&
                          project?.template !== null &&
                          'id' in project?.template
                            ? project?.template?.id
                            : project?.template
                        }
                        label="Template"
                        options={[
                          { label: 'None', value: '' },
                          ...(templates || [])?.map((template) => ({
                            label: template.name || '',
                            value: template.id,
                          })),
                        ]}
                        path="template"
                        required
                      />
                    )}
                    <RepoExists disabled initialValue={project?.repositoryFullName} />
                    <UniqueDomain
                      id={project?.id}
                      initialValue={project?.defaultDomain}
                      team={checkoutState?.team}
                    />
                  </div>
                </Accordion>
                {!isClone && (
                  <Fragment>
                    <Accordion label={<p>Build Settings</p>}>
                      <div className={classes.buildSettings}>
                        <Text
                          initialValue={project?.rootDirectory}
                          label="Root Directory"
                          path="rootDirectory"
                          placeholder="/"
                          required
                        />
                        <Text
                          description="Example: `pnpm install` or `npm install`"
                          initialValue={project?.installScript}
                          label="Install Command"
                          path="installScript"
                          placeholder="pnpm install"
                          required
                        />
                        <Text
                          description="Example: `pnpm build` or `npm run build`"
                          initialValue={project?.buildScript}
                          label="Build Command"
                          path="buildScript"
                          placeholder="pnpm build"
                          required
                        />
                        <Text
                          description="Example: `pnpm serve` or `npm run serve`"
                          initialValue={project?.runScript}
                          label="Serve Command"
                          path="runScript"
                          placeholder="pnpm serve"
                          required
                        />
                        <BranchSelector
                          initialValue={project?.deploymentBranch}
                          repositoryFullName={project?.repositoryFullName}
                        />
                        <Checkbox
                          initialValue={true}
                          label="Auto deploy on push"
                          path="autoDeploy"
                        />
                        <Text
                          description="Example: A Dockerfile in a src directory would require `src/Dockerfile`"
                          initialValue={project?.dockerfilePath}
                          label="Dockerfile Path"
                          path="dockerfilePath"
                        />
                      </div>
                    </Accordion>
                    <Accordion label="Environment Variables">
                      <EnvVars className={classes.envVars} />
                    </Accordion>
                  </Fragment>
                )}
                {!checkoutState?.freeTrial && (
                  <Accordion label="Payment Information" openOnInit>
                    <div className={classes.paymentInformation}>
                      {checkoutState?.freeTrial && (
                        <Message
                          margin={false}
                          success="You will not be charged until your 30 day free trial is over. We’ll remind you 7 days before your trial ends. Cancel anytime."
                        />
                      )}
                      <p className={classes.paymentInformationDescription}>
                        All projects without a payment method will be automatically deleted after 4
                        consecutive failed payment attempts within 30 days. If a payment method is
                        not specified for this project, we will attempt to charge your team's
                        default payment method (if any).
                      </p>
                      {checkoutState?.team && (
                        <CreditCardSelector
                          enableInlineSave={false}
                          initialPaymentMethods={initialPaymentMethods}
                          onChange={handleCardChange}
                          team={checkoutState?.team}
                        />
                      )}
                    </div>
                  </Accordion>
                )}
                <Checkbox
                  className={classes.agreeToTerms}
                  initialValue={false}
                  label={
                    <div>
                      {'I agree to the '}
                      <Link href="/cloud-terms" prefetch={false} target="_blank">
                        Terms of Service
                      </Link>
                    </div>
                  }
                  path="agreeToTerms"
                  required
                  validate={(value: boolean) => {
                    return !value
                      ? 'You must agree to the terms of service to deploy your project.'
                      : true
                  }}
                />
                <div className={classes.submit}>
                  <Submit label={checkoutState?.freeTrial ? 'Start free trial' : 'Deploy now'} />
                </div>
              </div>
              <HR />
              <CloneOrDeployProgress
                destination={project?.slug}
                repositoryFullName={project?.repositoryFullName}
                type="deploy"
              />
            </div>
          </div>
        </Gutter>
      </Form>
    </Fragment>
  )
}

const CheckoutProvider: React.FC<{
  initialPaymentMethods?: null | PaymentMethod[]
  installs: Install[]
  plans: Plan[]
  project: Project
  team: TeamWithCustomer
  templates: Template[]
  token: null | string
  user: null | undefined | User
}> = (props) => {
  const { initialPaymentMethods, installs, plans, project, team, templates, token, user } = props

  if (!project) {
    redirect('/404')
  }

  if (project?.status === 'published') {
    redirect(`/${cloudSlug}/${team?.slug}/${project.slug}`)
  }

  if (!token) {
    redirect(
      `/new/authorize?redirect=${encodeURIComponent(
        `/cloud/${team.slug}/${project.slug}/configure`,
      )}`,
    )
  }

  return (
    <Elements stripe={Stripe}>
      <Checkout
        initialPaymentMethods={initialPaymentMethods}
        installs={installs}
        plans={plans}
        project={project}
        templates={templates}
        user={user}
      />
    </Elements>
  )
}

export default CheckoutProvider
