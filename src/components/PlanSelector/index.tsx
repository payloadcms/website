import React, { Fragment, useEffect, useMemo, useState } from 'react'
import Label from '@forms/Label'

import { LargeRadio } from '@components/LargeRadio'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Plan } from '@root/payload-cloud-types'
import { priceFromJSON } from '@root/utilities/price-from-json'
import useDebounce from '@root/utilities/use-debounce'
import { UseGetPlans, useGetPlans } from '../../utilities/use-get-plans'

import classes from './index.module.scss'

type PlanSelectorProps = {
  value?: string
  onChange?: (value: Plan) => void // eslint-disable-line no-unused-vars
  isOrgScope?: boolean
  plans: Plan[]
  loading: boolean
  error: string | undefined
  initialSelection?: Plan
}

export const PlanSelector: React.FC<PlanSelectorProps> = props => {
  const {
    onChange,
    value: valueFromProps,
    isOrgScope,
    loading,
    error,
    plans,
    initialSelection,
  } = props
  const hasInitializedSelection = React.useRef(false)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(initialSelection)

  // initialize with the `free` plan
  useEffect(() => {
    if (plans?.length && !initialSelection && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedPlan(plans.find(plan => plan.slug === 'free'))
    }
  }, [plans, initialSelection])

  useEffect(() => {
    if (
      hasInitializedSelection &&
      valueFromProps !== undefined &&
      valueFromProps !== selectedPlan?.id &&
      plans?.length
    ) {
      const newSelection = plans.find(plan => plan.id === valueFromProps)
      setSelectedPlan(newSelection)
    }
  }, [valueFromProps, plans, selectedPlan])

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
                  label={name}
                />
              )
            })}
        </div>
      )}
    </Fragment>
  )
}

export const usePlanSelector = (args: {
  isOrgScope: boolean
  onChange?: (value: Plan) => void // eslint-disable-line no-unused-vars
}): [
  React.FC,
  ReturnType<UseGetPlans> & {
    value: Plan | undefined
  },
] => {
  const { isOrgScope, onChange } = args

  const [value, setValue] = useState<Plan | undefined>()
  const plansData = useGetPlans()
  const debouncedLoading = useDebounce(plansData.isLoading, 250)

  const MemoizedPlanSelector = useMemo(
    () => () => {
      const { error, plans } = plansData

      return (
        <PlanSelector
          loading={debouncedLoading}
          error={error}
          plans={plans}
          onChange={setValue}
          isOrgScope={isOrgScope}
        />
      )
    },
    [debouncedLoading, isOrgScope, plansData],
  )

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange(value)
    }
  }, [onChange, value])

  return [
    MemoizedPlanSelector,
    {
      ...plansData,
      value,
    },
  ]
}
