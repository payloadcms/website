import React, { Fragment, useEffect } from 'react'
import Label from '@forms/Label'

import { LargeRadio } from '@components/LargeRadio'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Plan } from '@root/payload-cloud-types'
import { priceFromJSON } from '@root/utilities/price-from-json'
import useDebounce from '@root/utilities/use-debounce'

import classes from './index.module.scss'

export const PlanSelector: React.FC<{
  value?: string
  onChange?: (value: Plan) => void // eslint-disable-line no-unused-vars
  isOrgScope?: boolean
}> = props => {
  const { onChange, value: valueFromProps, isOrgScope } = props
  const hasInitializedSelection = React.useRef(false)
  const hasMadeRequest = React.useRef(false)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined>()
  const [error, setError] = React.useState<string | undefined>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [plans, setPlans] = React.useState<Plan[]>([])

  useEffect(() => {
    if (hasMadeRequest.current) return
    hasMadeRequest.current = true

    const fetchPlans = async () => {
      try {
        setIsLoading(true)

        const plansReq = await fetch(
          `${process.env.NEXT_PUBLIC_CLOUD_CMS_URL}/api/plans?where[slug][not_equals]=enterprise`,
          {
            credentials: 'include',
          },
        )

        const json = await plansReq.json()

        if (plansReq.ok) {
          setPlans(json.docs)
          setIsLoading(false)
        } else {
          throw new Error(json.message)
        }
      } catch (err: any) {
        setError(err.message)
        setIsLoading(false)
      }
    }
    fetchPlans()
  }, [])

  useEffect(() => {
    if (valueFromProps === selectedPlan?.id && plans?.length) {
      const newSelection = plans.find(plan => plan.id === valueFromProps)
      setSelectedPlan(newSelection)
    }
  }, [valueFromProps, plans, selectedPlan])

  useEffect(() => {
    if (plans?.length && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedPlan(selectedPlan || plans.find(plan => plan.slug === 'free'))
    }
  }, [plans, selectedPlan])

  const loading = useDebounce(isLoading, 250)

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(selectedPlan)
    }
  }, [onChange, selectedPlan])

  useEffect(() => {
    if (isOrgScope && selectedPlan?.slug === 'free') {
      setSelectedPlan(plans.find(plan => plan.slug === 'pro'))
    }
  }, [isOrgScope, plans, selectedPlan])

  return (
    <Fragment>
      {error && <p>{error}</p>}
      {loading && (
        <Fragment>
          <Label label="Plan" htmlFor="cloud-plan" />
          <LoadingShimmer />
        </Fragment>
      )}
      {!loading && (
        <div className={classes.plans}>
          {plans &&
            plans.length > 0 &&
            plans.map(plan => {
              const { priceJSON, name, slug } = plan
              const checked = selectedPlan?.id === plan.id
              const price = priceFromJSON(priceJSON, false)
              const disabled = isOrgScope && slug === 'free'

              return (
                <LargeRadio
                  key={plan.id}
                  checked={checked}
                  disabled={disabled}
                  name={name}
                  id={plan.id}
                  value={plan}
                  price={price}
                  onChange={setSelectedPlan}
                />
              )
            })}
        </div>
      )}
    </Fragment>
  )
}
