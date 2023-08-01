import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleToggler,
  useCollapsible,
} from '@faceless-ui/collapsibles'

import { ChevronIcon } from '@root/icons/ChevronIcon'
import { DrawerCode } from '../Code'
import { configs } from './configs'

import classes from './index.module.scss'

const Toggler = () => {
  const { isOpen } = useCollapsible()

  return (
    <div className={classes.togglerWrap}>
      <CollapsibleToggler className={classes.toggler}>
        <h5 className={classes.toggleTitle}>Collection Config</h5>
        <ChevronIcon rotation={isOpen ? 90 : 270} />
      </CollapsibleToggler>
    </div>
  )
}

type Props = {
  type: 'array-example'
  className?: string
}
export const DrawerCollectionConfig: React.FC<Props> = ({ type, className }) => {
  const config = configs[type]

  return (
    <div className={[classes.collectionConfig, className].filter(Boolean).join(' ')}>
      <Collapsible openOnInit>
        <Toggler />
        <CollapsibleContent>
          <DrawerCode content={config} />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
