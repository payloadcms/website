import type { Plan } from '@root/payload-cloud-types'

import { LargeRadio } from '@components/LargeRadio/index'
import React, { Fragment, useEffect } from 'react'

import classes from './index.module.scss'

type PlanSelectorProps = {
  onChange?: (value?: null | Plan) => void
  plans: Plan[]
  selectedPlan?: null | Plan
}

export const PlanSelector: React.FC<PlanSelectorProps> = (props) => {
  const { onChange, plans, selectedPlan } = props

  return (
    <Fragment>
      <div>
        <div className={classes.plans}>
          {plans &&
            plans.length > 0 &&
            plans.map((plan) => {
              const { name } = plan || {}
              const checked = selectedPlan?.id === plan?.id

              return (
                <>
                  <LargeRadio
                    checked={checked}
                    id={plan.id}
                    key={plan.id}
                    label={<div className={classes.plan}>{name}</div>}
                    name={name}
                    onChange={onChange}
                    value={plan}
                  />
                </>
              )
            })}
        </div>
      </div>
    </Fragment>
  )
}
