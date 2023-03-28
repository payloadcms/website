import { BlockSpacing } from '@components/BlockSpacing'
import { PixelBackground } from '@components/PixelBackground'
import { Cell, Grid } from '@faceless-ui/css-grid'
import React from 'react'
import { SquareCard } from '@components/cards/SquareCard'
import { Page } from '@root/payload-types'
import { Gutter } from '@components/Gutter'
import { CheckmarkIcon } from '@root/graphics/CheckmarkIcon'
import { CloseIcon } from '@root/graphics/CloseIcon'
import { Collapsible, CollapsibleToggler, CollapsibleContent } from '@faceless-ui/collapsibles'
import { ChevronIcon } from '@root/graphics/ChevronIcon'
import classes from './index.module.scss'

export type Props = Extract<Page['layout'][0], { blockType: 'pricing' }>

export const Pricing: React.FC<Props> = ({ pricingFields }) => {
  const { plans } = pricingFields

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
                {icon === 'check' && <CheckmarkIcon />}
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
                const { name, price, description, link, features } = plan
                const isToggled = toggledPlan === name

                return (
                  <Cell className={classes.planWrap} key={i} cols={4} colsM={8}>
                    <SquareCard
                      leader={name}
                      className={classes.card}
                      title={price}
                      description={description}
                      link={link}
                      appearance="pricing"
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
                          <label>
                            Features
                            <ChevronIcon
                              className={[classes.chevron, isToggled && classes.open]
                                .filter(Boolean)
                                .join(' ')}
                            />
                          </label>
                        </CollapsibleToggler>
                      </Collapsible>
                    </div>
                  </Cell>
                )
              })}
            </Grid>
          </div>
        )}
      </Gutter>
    </BlockSpacing>
  )
}
