import React, { Fragment } from 'react'
import { useModal } from '@faceless-ui/modal'

import { PricingCard } from '@components/cards/PricingCard/index.js'
import { Drawer, DrawerToggler } from '@components/Drawer/index.js'
import { ArrowIcon } from '@root/icons/ArrowIcon/index.js'
import { CheckIcon } from '@root/icons/CheckIcon/index.js'
import { CloseIcon } from '@root/icons/CloseIcon/index.js'
import { Plan } from '@root/payload-cloud-types.js'

import classes from './index.module.scss'

type ComparePlansProps = {
  plans: Plan[]
  handlePlanChange: (value?: Plan | null) => void // eslint-disable-line no-unused-vars
}

export const ComparePlans: React.FC<ComparePlansProps> = props => {
  const { plans, handlePlanChange } = props
  const { closeModal } = useModal()

  const handleSelect = (plan: Plan) => {
    handlePlanChange(plan)
    closeModal(`comparePlans`)
  }

  return (
    <Fragment>
      <DrawerToggler slug={`comparePlans`} className={classes.drawerToggle}>
        Compare Plans
        <ArrowIcon />
      </DrawerToggler>
      <Drawer slug={`comparePlans`} title={'Compare Plans'} size={plans.length > 2 ? 'l' : 'm'}>
        <div className={classes.compareTable}>
          {plans?.map((plan, i) => {
            const getPrice = plan => {
              let price = ''
              if (typeof plan === 'object' && plan !== null && 'priceJSON' in plan) {
                price = plan?.priceJSON?.toString() || ''
                const parsed = JSON.parse(price)
                return (parsed?.unit_amount / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })
              }
            }

            const highlight = plan.highlight ? classes.highlight : ''

            return (
              <div key={i} className={classes.planCard} onClick={() => handleSelect(plan)}>
                <PricingCard
                  key={plan.name}
                  leader={plan.name}
                  price={getPrice(plan)}
                  description={plan.description}
                  className={[classes.pricingCard, highlight].join(' ')}
                />
                <ul className={classes.features}>
                  {plan?.features?.map((feature, i) => {
                    return (
                      <li key={i} className={classes.feature}>
                        <div className={feature.icon && classes[feature.icon]}>
                          {feature.icon === 'check' && <CheckIcon size="medium" />}
                          {feature.icon === 'x' && <CloseIcon />}
                        </div>
                        {feature.feature}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </Drawer>
    </Fragment>
  )
}
