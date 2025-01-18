import type { Partner } from '@root/payload-types'

import { BackgroundScanline } from '@components/BackgroundScanline'
import { Media } from '@components/Media'
import { ArrowIcon } from '@root/icons/ArrowIcon'
import Link from 'next/link'

import classes from './index.module.scss'

type PartnerCardProps = Partner

export const PartnerCard = (partner: PartnerCardProps) => {
  return (
    <Link className={classes.partnerCard} href={`/partners/${partner.slug}`}>
      <div className={classes.partnerCardImage}>
        {typeof partner.content.bannerImage !== 'string' && (
          <Media resource={partner.content.bannerImage} />
        )}
      </div>
      <div className={classes.partnerCardInfo}>
        <h5 className={classes.partnerCardName}>{partner.name}</h5>
        <p className={classes.partnerCardCity}>{partner.city}</p>
        <BackgroundScanline className={classes.scanlines} />
        <ArrowIcon className={classes.arrow} />
      </div>
    </Link>
  )
}
