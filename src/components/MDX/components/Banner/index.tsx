import type { ReusableContent } from '@root/payload-types.js'

import { RichText } from '../../../RichText/index.js'
import classes from './index.module.scss'

export type Props = {
  checkmark?: boolean
  children?: React.ReactNode
  content?: Extract<
    ReusableContent['layout'][0],
    { blockType: 'banner' }
  >['bannerFields']['content']
  icon?: 'checkmark'
  margin?: boolean
  type?: Extract<ReusableContent['layout'][0], { blockType: 'banner' }>['bannerFields']['type']
}

export const Banner: (props) => React.JSX.Element = ({
  type = 'default',
  children,
  content,
  margin = true,
}) => {
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
