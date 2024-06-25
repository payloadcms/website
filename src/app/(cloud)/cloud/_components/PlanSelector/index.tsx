import React, { Fragment, useEffect } from 'react'

import { LargeRadio } from '@components/LargeRadio/index.js'
import { Plan } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

type PlanSelectorProps = {
  plans: Plan[]
  onChange?: (value?: Plan | null) => void // eslint-disable-line no-unused-vars
  selectedPlan?: Plan | null
}

export const PlanSelector: React.FC<PlanSelectorProps> = props => {
  const { onChange, plans, selectedPlan } = props

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
                <>
                  <LargeRadio
                    key={plan.id}
                    checked={checked}
                    name={name}
                    id={plan.id}
                    value={plan}
                    onChange={onChange}
                    label={<div className={classes.plan}>{name}</div>}
                  />
                </>
              )
            })}
        </div>
      </div>
    </Fragment>
  )
}
