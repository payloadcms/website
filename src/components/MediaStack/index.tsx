import type { Media as MediaType } from '@root/payload-types'

import { Media } from '@components/Media'
import Image from 'next/image'

import classes from './index.module.scss'

type MediaStackProps = {
  media: {
    image: MediaType | string
  }[]
}

export const MediaStack: React.FC<MediaStackProps> = ({ media }) => {
  return (
    <div className={classes.stack}>
      {typeof media[0].image !== 'string' && (
        <Media className={classes.mediaOne} resource={media[0].image} />
      )}
      {typeof media[1].image !== 'string' && (
        <Media className={classes.mediaTwo} resource={media[1].image} />
      )}
    </div>
  )
}
