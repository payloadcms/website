import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'

import { BlockSpacing } from '@components/BlockSpacing'
import { PricingCard } from '@components/cards/PricingCard'
import { Gutter } from '@components/Gutter'
import { PixelBackground } from '@components/PixelBackground'
import { ChevronIcon } from '@root/graphics/ChevronIcon'
import { CheckIcon } from '@root/icons/CheckIcon'
import { CloseIcon } from '@root/icons/CloseIcon'
import { Page } from '@root/payload-types'

import classes from './index.module.scss'

export type Props = Extract<Page['layout'][0], { blockType: 'pricing' }>

export const Pricing: React.FC<Props> = ({ pricingFields }) => {
  const { plans, disclaimer } = pricingFields || {}

  const [toggledPlan, setToggledPlan] = React.useState('')
  const hasPlans = Array.isArray(plans) && plans.length > 0

  const featureList = features => {
    return (
      <ul className={classes.features}>
        {features.map((item, index) => {
          const { feature, icon } = item
          return (
            <li className={classes.feature} key={index}>
              <div className={icon && classes[icon]}>
                {icon === 'check' && <CheckIcon size="medium" />}
                {icon === 'x' && <CloseIcon />}
              </div>
              {feature}
            </li>
          )
        })}
      </ul>
    )
  }

  const colsStart = {
    0: 'start-1 start-m-1',
    1: 'start-5 start-m-1',
    2: 'start-9 start-m-1',
    3: 'start-12 start-m-1',
  }

  return (
    <BlockSpacing className={classes.pricingBlock}>
      <Gutter>
        {hasPlans && (
          <div className={classes.wrap}>
            <div className={classes.bg}>
              <PixelBackground />
            </div>
            <div className={['grid'].filter(Boolean).join(' ')}>
              {plans.map((plan, i) => {
                const { name, title, price, description, link, features } = plan
                const isToggled = toggledPlan === name

                return (
                  <div
                    key={i}
                    className={[classes.planWrap, 'cols-4 cols-m-8', colsStart[i]]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <PricingCard
                      leader={name}
                      className={classes.card}
                      price={price}
                      title={title}
                      description={description}
                      link={link}
                    />

                    <div className={classes.list}>{featureList(features)}</div>

                    <div className={classes.collapsibleList}>
                      <Collapsible
                        initialHeight={0}
                        transTime={250}
                        transCurve="ease-in"
                        onToggle={() => {
                          setToggledPlan(toggledPlan === name ? '' : name)
                        }}
                        open={isToggled}
                      >
                        <CollapsibleContent>{featureList(features)}</CollapsibleContent>
                        <CollapsibleToggler className={classes.toggler}>
                          Features
                          <ChevronIcon
                            className={[classes.chevron, isToggled && classes.open]
                              .filter(Boolean)
                              .join(' ')}
                          />
                        </CollapsibleToggler>
                      </Collapsible>
                    </div>
                  </div>
                )
              })}
              {disclaimer && (
                <div className={[].filter(Boolean).join(' ')}>
                  <div className={classes.disclaimer}>
                    <i>{disclaimer}</i>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Gutter>
    </BlockSpacing>
  )
}
