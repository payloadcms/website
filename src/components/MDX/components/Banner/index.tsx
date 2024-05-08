import { CheckIcon } from '@root/icons/CheckIcon'
import { ReusableContent } from '@root/payload-types'
import { RichText } from '../../../RichText'

import classes from './index.module.scss'

export type Props = {
  type?: Extract<ReusableContent['layout'][0], { blockType: 'banner' }>['bannerFields']['type']
  content?: Extract<
    ReusableContent['layout'][0],
    { blockType: 'banner' }
  >['bannerFields']['content']
  children?: React.ReactNode
  checkmark?: boolean
  icon?: 'checkmark'
  margin?: boolean
}

export const Banner: React.FC<Props> = ({ content, children, type = 'default', margin = true }) => {
  return (
    <div
      className={[classes.banner, 'banner', type && classes[type], !margin && classes.noMargin]
        .filter(Boolean)
        .join(' ')}
    >
      {content && <RichText content={content} />}
      {children && <div className={classes.children}>{children}</div>}
    </div>
  )
}
