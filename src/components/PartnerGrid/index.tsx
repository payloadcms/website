import type { Partner } from '@root/payload-types'

import { PartnerCard } from '@components/cards/PartnerCard'

import classes from './index.module.scss'

type PartnerGridProps = {
  featured?: boolean
  partners: (Partner | string)[]
}

export const PartnerGrid = (props: PartnerGridProps) => {
  const { featured, partners } = props
  return (
    <div className={classes.PartnerGridWrap}>
      {partners.map((partner) => {
        return (
          typeof partner !== 'string' && (
            <PartnerCard {...partner} key={partner.id + featured ? '_featured' : ''} />
          )
        )
      })}
    </div>
  )
}
