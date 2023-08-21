'use client'

import React, { Fragment, useCallback } from 'react'
import { toast } from 'react-toastify'
import { revalidateCache } from '@cloud/_actions/revalidateCache'
import { Install } from '@cloud/_api/fetchInstalls'
import { TeamWithCustomer } from '@cloud/_api/fetchTeam'
import { BranchSelector } from '@cloud/_components/BranchSelector'
import { CreditCardSelector } from '@cloud/_components/CreditCardSelector'
import { useInstallationSelector } from '@cloud/_components/InstallationSelector'
import { PlanSelector } from '@cloud/_components/PlanSelector'
import { TeamSelector } from '@cloud/_components/TeamSelector'
import { UniqueDomain } from '@cloud/_components/UniqueDomain'
import { UniqueRepoName } from '@cloud/_components/UniqueRepoName'
import { UniqueProjectSlug } from '@cloud/_components/UniqueSlug'
import { cloudSlug } from '@cloud/slug'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormSubmissionError from '@forms/FormSubmissionError'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe, type PaymentMethod } from '@stripe/stripe-js'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'

import { Button } from '@components/Button'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { Accordion } from '@root/app/_components/Accordion'
import { HR } from '@root/app/_components/HR'
import { Message } from '@root/app/_components/Message'
import { Plan, Project, Team, Template, User } from '@root/payload-cloud-types'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { CloneOrDeployProgress } from '../../cloud/_components/CloneOrDeployProgress'
import { deploy } from './deploy'
import { EnvVars } from './EnvVars'
import { checkoutReducer, CheckoutState } from './reducer'

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
  project: Project | null | undefined
  plans: Plan[]
  installs: Install[]
  templates: Template[]
  user: User | null | undefined
  initialPaymentMethods?: PaymentMethod[] | null
}> = props => {
  const { project, plans, installs, templates, user, initialPaymentMethods } = props
  const isClone = Boolean(!project?.repositoryID)
  const stripe = useStripe()
  const elements = useElements()

  const router = useRouter()

  const [deleting, setDeleting] = React.useState(false)
  const [errorDeleting, setErrorDeleting] = React.useState('')

  const [checkoutState, dispatchCheckoutState] = React.useReducer(checkoutReducer, {
    plan: project?.plan,
    team: project?.team,
    paymentMethod: '',
    freeTrial: true,
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

  const [InstallationSelector, { value: selectedInstall, error: installsError }] =
    useInstallationSelector({
      initialInstallID: project?.installID,
      permissions: isClone ? 'write' : undefined,
      installs,
    })

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
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
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
        project,
        checkoutState,
        onDeploy,
        user,
        stripe,
        elements,
        unflattenedData,
        installID: selectedInstall?.id.toString() || project?.installID,
      })
    },
    [checkoutState, onDeploy, project, selectedInstall, user, stripe, elements],
  )

  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
          <Heading element="h1" marginTop={false}>
            {deleting ? 'Canceling draft project...' : title}
          </Heading>
        </div>
      </Gutter>
      <Form onSubmit={handleSubmit}>
        <Gutter>
          <div className={classes.formState}>
            <FormSubmissionError />
            {(installsError || errorDeleting) && <Message error={installsError || errorDeleting} />}
          </div>
          <Grid>
            <Cell cols={3} colsM={8} className={classes.sidebarCell}>
              <div className={classes.sidebar}>
                <Fragment>
                  <div className={classes.installationSelector}>
                    {isClone && (
                      <InstallationSelector
                        description={`Select where to create this repository.`}
                      />
                    )}
                    {!isClone && (
                      <div>
                        <Text label="Repository" value={project?.repositoryFullName} disabled />
                      </div>
                    )}
                  </div>
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
                      {checkoutState?.freeTrial && (
                        <Fragment>
                          <br />
                          <span className={classes.trialDescription}>Free for 30 days</span>
                        </Fragment>
                      )}
                    </p>
                  </div>
                  <Button
                    onClick={deleteProject}
                    label="Cancel"
                    appearance="text"
                    className={classes.cancel}
                  />
                </Fragment>
              </div>
            </Cell>
            <Cell cols={9} colsM={8}>
              <div>
                <div className={classes.plansSection}>
                  <Heading element="h5" marginTop={false}>
                    Select your plan
                  </Heading>
                  <div className={classes.plans}>
                    <PlanSelector
                      plans={plans}
                      onChange={handlePlanChange}
                      initialSelection={project?.plan}
                    />
                  </div>
                  <Checkbox
                    label="Free trial, no credit card required"
                    initialValue={checkoutState?.freeTrial}
                    className={classes.freeTrial}
                    onChange={(value: boolean) => {
                      dispatchCheckoutState({
                        type: 'SET_FREE_TRIAL',
                        payload: value,
                      })
                    }}
                  />
                </div>
                <Heading element="h5" marginTop={false}>
                  Configure your project
                </Heading>
                <div className={classes.fields}>
                  <Accordion label={<p>Project Details</p>} openOnInit>
                    <div className={classes.projectDetails}>
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
                        required
                      />
                      <Text
                        label="Project name"
                        path="name"
                        initialValue={project?.name}
                        required
                      />
                      <UniqueProjectSlug
                        initialValue={project?.slug}
                        teamID={
                          typeof project?.team === 'string' ? project?.team : project?.team?.id
                        }
                        projectID={project?.id}
                        validateOnInit={true}
                      />
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
                        required
                        user={user}
                      />
                      {isClone && (
                        <Fragment>
                          <Select
                            label="Template"
                            path="template"
                            disabled={Boolean(project?.repositoryID)}
                            initialValue={
                              typeof project?.template === 'object' &&
                              project?.template !== null &&
                              'id' in project?.template
                                ? project?.template?.id
                                : project?.template
                            }
                            options={[
                              { label: 'None', value: '' },
                              ...(templates || [])?.map(template => ({
                                label: template.name || '',
                                value: template.id,
                              })),
                            ]}
                            required
                          />
                          <UniqueRepoName
                            repositoryOwner={selectedInstall?.account?.login}
                            initialValue={project?.repositoryName}
                          />
                          <Checkbox
                            path="makePrivate"
                            label="Create private Git repository"
                            initialValue={project?.makePrivate || true}
                          />
                        </Fragment>
                      )}
                    </div>
                  </Accordion>
                  <Accordion label={<p>Build Settings</p>}>
                    <div className={classes.buildSettings}>
                      <Text
                        label="Root Directory"
                        placeholder="/"
                        path="rootDirectory"
                        initialValue={project?.rootDirectory}
                        required
                      />
                      <Text
                        label="Install Command"
                        path="installScript"
                        placeholder="yarn install"
                        initialValue={project?.installScript}
                        required
                        description="Example: `yarn install` or `npm install`"
                      />
                      <Text
                        label="Build Command"
                        path="buildScript"
                        placeholder="yarn build"
                        initialValue={project?.buildScript}
                        required
                        description="Example: `yarn build` or `npm run build`"
                      />
                      <Text
                        label="Serve Command"
                        path="runScript"
                        placeholder="yarn serve"
                        initialValue={project?.runScript}
                        required
                        description="Example: `yarn serve` or `npm run serve`"
                      />
                      <BranchSelector
                        repositoryFullName={project?.repositoryFullName}
                        initialValue={project?.deploymentBranch}
                      />
                      <UniqueDomain initialSubdomain={project?.slug} team={checkoutState?.team} />
                    </div>
                  </Accordion>
                  <Accordion label="Environment Variables">
                    <EnvVars className={classes.envVars} />
                  </Accordion>
                  <Accordion label="Payment Information">
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
                          team={checkoutState?.team}
                          onChange={handleCardChange}
                          enableInlineSave={false}
                          initialPaymentMethods={initialPaymentMethods}
                        />
                      )}
                    </div>
                  </Accordion>
                  <Checkbox
                    path="agreeToTerms"
                    label={
                      <div>
                        {'I agree to the '}
                        <Link href="/cloud-terms" target="_blank" prefetch={false}>
                          Terms of Service
                        </Link>
                      </div>
                    }
                    required
                    className={classes.agreeToTerms}
                    initialValue={false}
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
                  type="deploy"
                  repositoryFullName={project?.repositoryFullName}
                  destination={project?.slug}
                />
              </div>
            </Cell>
          </Grid>
        </Gutter>
      </Form>
    </Fragment>
  )
}

const CheckoutProvider: React.FC<{
  team: TeamWithCustomer
  project: Project
  plans: Plan[]
  token: string | null
  installs: Install[]
  templates: Template[]
  user: User | null | undefined
  initialPaymentMethods?: PaymentMethod[] | null
}> = props => {
  const { team, project, token, plans, installs, templates, user, initialPaymentMethods } = props

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
        project={project}
        plans={plans}
        installs={installs}
        templates={templates}
        user={user}
        initialPaymentMethods={initialPaymentMethods}
      />
    </Elements>
  )
}

export default CheckoutProvider
