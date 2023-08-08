'use client'

import React, { Fragment, useCallback, useMemo } from 'react'
import { toast } from 'react-toastify'
import { cloudSlug } from '@cloud/_components/DashboardHeader'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import Form from '@forms/Form'
import FormProcessing from '@forms/FormProcessing'
import FormSubmissionError from '@forms/FormSubmissionError'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { redirect, useRouter } from 'next/navigation'

import { BranchSelector } from '@components/BranchSelector'
import { Button } from '@components/Button'
import { CreditCardSelector } from '@components/CreditCardSelector'
import { Gutter } from '@components/Gutter'
import { Heading } from '@components/Heading'
import { useInstallationSelector } from '@components/InstallationSelector'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { PlanSelector } from '@components/PlanSelector'
import { TeamSelector } from '@components/TeamSelector'
import { UniqueDomain } from '@components/UniqueDomain'
import { UniqueRepoName } from '@components/UniqueRepoName'
import { UniqueProjectSlug } from '@components/UniqueSlug'
import { Accordion } from '@root/app/_components/Accordion'
import { Message } from '@root/app/_components/Message'
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
  project: Project | null | undefined
}> = props => {
  const { project } = props
  const isClone = Boolean(!project?.repositoryID)

  const router = useRouter()
  const { templates } = useGlobals()

  const [deleting, setDeleting] = React.useState(false)
  const [errorDeleting, setErrorDeleting] = React.useState('')

  const [checkoutState, dispatchCheckoutState] = React.useReducer(checkoutReducer, {
    plan: project?.plan,
    team: project?.team,
    paymentMethod: '',
    freeTrial:
      project?.plan && typeof project?.plan !== 'string' && project?.plan?.slug === 'standard'
        ? true
        : false,
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

  const [
    InstallationSelector,
    { value: selectedInstall, loading: installsLoading, error: installsError },
  ] = useInstallationSelector({
    initialInstallID: project?.installID,
    permissions: isClone ? 'write' : undefined,
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

  const deploy = useDeploy({
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

  return (
    <Form onSubmit={deploy}>
      <Gutter>
        <div className={classes.formState}>
          <FormProcessing message="Deploying project, one moment..." />
          <FormSubmissionError />
          {installsError && <p className={classes.error}>{installsError}</p>}
          {errorDeleting && <p className={classes.error}>{errorDeleting}</p>}
          {deleting && <p>Deleting draft project, one moment...</p>}
        </div>
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
                      {checkoutState?.freeTrial && <p>Free for 14 days</p>}
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
              <div>
                <div>
                  <Heading element="h5" marginTop={false}>
                    Select your plan
                  </Heading>
                  <div className={classes.plans}>
                    <PlanSelector onChange={handlePlanChange} />
                  </div>
                </div>
                <Heading element="h5">Configure your project</Heading>
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
                            initialValue={project?.makePrivate || false}
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
                          success="You will not be charged until your 14 day free trial is over. Projects without a payment method will be deleted after 4 consecutive failed payment attempts. We’ll remind you 7 days before your trial ends. Cancel anytime."
                        />
                      )}
                      {checkoutState?.team && (
                        <CreditCardSelector
                          initialValue={checkoutState?.paymentMethod}
                          team={checkoutState?.team}
                          onChange={handleCardChange}
                          enableInlineSave={false}
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
              </div>
            )}
          </Cell>
        </Grid>
      </Gutter>
    </Form>
  )
}

// The `CheckoutProvider`
// 1. verifies GitHub authorization
// 2. initializes Stripe Elements provider
// 3. Loads the initial Payload project
// 4. handles 404s and redirects
// 5. simplifies initial state and loading
const CheckoutProvider: React.FC<{
  teamSlug: string
  projectSlug: string
  tokenLoading: boolean
}> = props => {
  const { teamSlug, projectSlug, tokenLoading } = props

  const { result: project, isLoading: projectLoading } = useGetProject({
    teamSlug,
    projectSlug,
  })

  if (projectLoading === false && !project) {
    redirect('/404')
  }

  if (projectLoading === false && project?.status === 'published') {
    redirect(`/${cloudSlug}/${project?.team?.slug}/${project.slug}`)
  }

  return (
    <Fragment>
      <Gutter>
        <div className={classes.header}>
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
          <Checkout project={project} />
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
  teamSlug: string
  projectSlug: string
}> = ({ teamSlug, projectSlug }) => {
  useAuthRedirect()
  const { tokenLoading } = useGitAuthRedirect()

  const memoizedCheckoutProvider = useMemo(() => {
    return (
      <CheckoutProvider teamSlug={teamSlug} projectSlug={projectSlug} tokenLoading={tokenLoading} />
    )
  }, [teamSlug, projectSlug, tokenLoading])

  return memoizedCheckoutProvider
}

export default CheckoutAuthentication
