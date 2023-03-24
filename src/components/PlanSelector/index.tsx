import React, { Fragment, useEffect, useMemo } from 'react'
import Label from '@forms/Label'

import { LargeRadio } from '@components/LargeRadio'
import { LoadingShimmer } from '@components/LoadingShimmer'
import { Plan } from '@root/payload-cloud-types'
import { priceFromJSON } from '@root/utilities/price-from-json'
import { UseCloud, useGetPlans } from '@root/utilities/use-cloud'
import useDebounce from '@root/utilities/use-debounce'

import classes from './index.module.scss'

type PlanSelectorProps = {
  value?: string
  onChange?: (value?: Plan | null) => void // eslint-disable-line no-unused-vars
  plans: Plan[]
  loading: boolean
  error: string | undefined
  initialSelection?: Plan
  onFreeTrialChange?: (value?: boolean) => void // eslint-disable-line no-unused-vars
  freeTrial?: boolean
}

export const PlanSelector: React.FC<PlanSelectorProps> = props => {
  const { onChange, value: valueFromProps, loading, error, plans, initialSelection } = props

  const hasInitializedSelection = React.useRef(false)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined | null>(initialSelection)

  // initialize with the `standard` plan
  useEffect(() => {
    if (plans?.length && !initialSelection && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedPlan(plans.find(plan => plan.slug === 'standard'))
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
        <div>
          <div className={classes.plans}>
            {plans &&
              plans.length > 0 &&
              plans.map(plan => {
                const { priceJSON, name } = plan
                const checked = selectedPlan?.id === plan.id
                const price = priceFromJSON(priceJSON, false)

                return (
                  <LargeRadio
                    key={plan.id}
                    checked={checked}
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
        </div>
      )}
    </Fragment>
  )
}

export const usePlanSelector = (args: {
  onChange?: (value: Plan) => void // eslint-disable-line no-unused-vars
}): [React.FC, ReturnType<UseCloud<Plan>>] => {
  const { onChange } = args

  const plansData = useGetPlans()
  const debouncedLoading = useDebounce(plansData.isLoading, 250)

  const MemoizedPlanSelector = useMemo(
    () => () => {
      const { error, result: plans } = plansData

      return (
        <PlanSelector
          loading={Boolean(debouncedLoading)}
          error={error}
          plans={plans}
          onChange={onChange}
        />
      )
    },
    [debouncedLoading, plansData, onChange],
  )

  return [MemoizedPlanSelector, plansData]
}
