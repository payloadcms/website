import React, { Fragment, useEffect } from 'react'

import { LargeRadio } from '@components/LargeRadio'
import { Plan } from '@root/payload-cloud-types'

import classes from './index.module.scss'

type PlanSelectorProps = {
  plans: Plan[]
  value?: string
  onChange?: (value?: Plan | null) => void // eslint-disable-line no-unused-vars
  initialSelection?: Plan | string
  onFreeTrialChange?: (value?: boolean) => void // eslint-disable-line no-unused-vars
}

export const PlanSelector: React.FC<PlanSelectorProps> = props => {
  const { onChange, value: valueFromProps, plans, initialSelection } = props

  const hasInitializedSelection = React.useRef(false)
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | undefined | null>(
    typeof initialSelection === 'string'
      ? plans?.find(plan => plan.id === initialSelection)
      : initialSelection,
  )

  // initialize with the `standard` plan
  // fallback to the first plan in the list
  useEffect(() => {
    if (plans?.length && !initialSelection && !hasInitializedSelection.current) {
      hasInitializedSelection.current = true
      setSelectedPlan(plans?.find(plan => plan.slug === 'standard') || plans?.[0])
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
      <div>
        <div className={classes.plans}>
          {plans &&
            plans.length > 0 &&
            plans.map(plan => {
              const { name } = plan || {}
              const checked = selectedPlan?.id === plan?.id

              return (
                <LargeRadio
                  key={plan.id}
                  checked={checked}
                  name={name}
                  id={plan.id}
                  value={plan}
                  onChange={setSelectedPlan}
                  label={name}
                />
              )
            })}
        </div>
      </div>
    </Fragment>
  )
}
