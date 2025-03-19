import type { PaddingProps } from '@components/BlockWrapper/index'
import type { Page } from '@root/payload-types'

import { BackgroundGrid } from '@components/BackgroundGrid/index'
import { BackgroundScanline } from '@components/BackgroundScanline/index'
import { BlockWrapper } from '@components/BlockWrapper/index'
import { PricingCard } from '@components/cards/PricingCard/index'
import { CMSLink } from '@components/CMSLink/index'
import CreatePayloadApp from '@components/CreatePayloadApp/index'
import { Gutter } from '@components/Gutter/index'
import { Collapsible, CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'
import { ChevronIcon } from '@root/graphics/ChevronIcon/index'
import { CheckIcon } from '@root/icons/CheckIcon/index'
import { CloseIcon } from '@root/icons/CloseIcon/index'
import { CrosshairIcon } from '@root/icons/CrosshairIcon/index'
import React from 'react'

import classes from './index.module.scss'

export type Props = {
  hideBackground?: boolean
  padding: PaddingProps
} & Extract<Page['layout'][0], { blockType: 'pricing' }>

export const Pricing: React.FC<Props> = ({ hideBackground, padding, pricingFields }) => {
  const { disclaimer, plans, settings } = pricingFields || {}

  const [toggledPlan, setToggledPlan] = React.useState('')
  const hasPlans = Array.isArray(plans) && plans.length > 0

  const featureList = (features) => {
    return (
      <ul className={classes.features}>
        {features.map((item, index) => {
          const { feature, icon } = item
          return (
            <li className={classes.feature} key={index}>
              <div className={icon && classes[icon]}>
                {icon === 'check' && <CheckIcon size="large" />}
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
    3: 'start-13 start-m-1',
  }

  return (
    <BlockWrapper
      className={classes.pricingBlock}
      hideBackground={hideBackground}
      padding={padding}
      settings={settings}
    >
      <BackgroundGrid zIndex={1} />
      <Gutter className={classes.gutter}>
        <BackgroundScanline className={classes.scanline} enableBorders />
        {hasPlans && (
          <div className={[classes.wrapper, 'grid'].filter(Boolean).join(' ')}>
            {plans.map((plan, i) => {
              const {
                name,
                description,
                enableCreatePayload,
                enableLink,
                features,
                hasPrice,
                link,
                price,
                title,
              } = plan
              const isToggled = toggledPlan === name
              const isLast = i + 1 === plans.length

              return (
                <div
                  className={[classes.plan, 'cols-4 cols-m-8', colsStart[i]]
                    .filter(Boolean)
                    .join(' ')}
                  key={i}
                >
                  <CrosshairIcon className={classes.crosshairTopLeft} />

                  {isLast && <CrosshairIcon className={classes.crosshairTopRight} />}

                  <PricingCard
                    className={classes.card}
                    description={description}
                    hasPrice={hasPrice}
                    leader={name}
                    link={link}
                    price={price}
                    title={title}
                  />

                  <div className={classes.collapsibleList}>
                    <Collapsible
                      initialHeight={0}
                      onToggle={() => {
                        setToggledPlan(toggledPlan === name ? '' : name)
                      }}
                      open={isToggled}
                      transCurve="ease-in"
                      transTime={250}
                    >
                      <CollapsibleToggler className={classes.toggler}>
                        What's included
                        <ChevronIcon
                          className={[classes.chevron, isToggled && classes.open]
                            .filter(Boolean)
                            .join(' ')}
                        />
                      </CollapsibleToggler>
                      <CollapsibleContent>{featureList(features)}</CollapsibleContent>
                    </Collapsible>
                  </div>

                  {(enableLink || enableCreatePayload) && (
                    <div className={classes.ctaWrapper}>
                      {enableLink && (
                        <CMSLink
                          appearance={'default'}
                          className={classes.link}
                          {...link}
                          buttonProps={{
                            hideBorders: true,
                          }}
                        />
                      )}

                      {enableCreatePayload && (
                        <CreatePayloadApp background={false} className={classes.createPayloadApp} />
                      )}
                    </div>
                  )}

                  <div className={classes.list}>{featureList(features)}</div>
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
        )}
      </Gutter>
    </BlockWrapper>
  )
}
