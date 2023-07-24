import React from 'react'
import { Collapsible, CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'
import { Cell, Grid } from '@faceless-ui/css-grid'

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

  return (
    <BlockSpacing className={classes.pricingBlock}>
      <Gutter>
        {hasPlans && (
          <div className={classes.wrap}>
            <div className={classes.bg}>
              <PixelBackground />
            </div>
            <Grid>
              {plans.map((plan, i) => {
                const { name, title, price, description, link, features } = plan
                const isToggled = toggledPlan === name

                return (
                  <Cell className={classes.planWrap} key={i} cols={4} colsM={8}>
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
                  </Cell>
                )
              })}
              {disclaimer && (
                <Cell>
                  <div className={classes.disclaimer}>
                    <i>{disclaimer}</i>
                  </div>
                </Cell>
              )}
            </Grid>
          </div>
        )}
      </Gutter>
    </BlockSpacing>
  )
}
