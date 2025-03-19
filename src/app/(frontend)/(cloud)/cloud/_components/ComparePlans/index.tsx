import type { Plan } from '@root/payload-cloud-types'

import { PricingCard } from '@components/cards/PricingCard/index'
import { Drawer, DrawerToggler } from '@components/Drawer/index'
import { useModal } from '@faceless-ui/modal'
import { ArrowIcon } from '@root/icons/ArrowIcon/index'
import { CheckIcon } from '@root/icons/CheckIcon/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import React, { Fragment } from 'react'

import classes from './index.module.scss'

type ComparePlansProps = {
  handlePlanChange: (value?: null | Plan) => void
  plans: Plan[]
}

export const ComparePlans: React.FC<ComparePlansProps> = (props) => {
  const { handlePlanChange, plans } = props
  const { closeModal } = useModal()

  const handleSelect = (plan: Plan) => {
    handlePlanChange(plan)
    closeModal(`comparePlans`)
  }

  return (
    <Fragment>
      <DrawerToggler className={classes.drawerToggle} slug={`comparePlans`}>
        Compare Plans
        <ArrowIcon />
      </DrawerToggler>
      <Drawer size={plans.length > 2 ? 'l' : 'm'} slug={`comparePlans`} title={'Compare Plans'}>
        <div className={classes.compareTable}>
          {plans?.map((plan, i) => {
            const getPrice = (plan) => {
              let price = ''
              if (typeof plan === 'object' && plan !== null && 'priceJSON' in plan) {
                price = plan?.priceJSON?.toString() || ''
                const parsed = JSON.parse(price)
                return (parsed?.unit_amount / 100).toLocaleString('en-US', {
                  currency: 'USD',
                  style: 'currency',
                })
              }
            }

            const highlight = plan.highlight ? classes.highlight : ''

            return (
              <div className={classes.planCard} key={i} onClick={() => handleSelect(plan)}>
                <PricingCard
                  className={[classes.pricingCard, highlight].join(' ')}
                  description={plan.description}
                  key={plan.name}
                  leader={plan.name}
                  price={getPrice(plan)}
                />
                <ul className={classes.features}>
                  {plan?.features?.map((feature, i) => {
                    return (
                      <li className={classes.feature} key={i}>
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
