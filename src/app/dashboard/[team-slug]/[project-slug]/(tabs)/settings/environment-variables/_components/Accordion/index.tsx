import * as React from 'react'
import { CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'

import { EyeIcon } from '@root/icons/EyeIcon'

import classes from './index.module.scss'

const Icons = {
  eye: EyeIcon,
}

type Props = {
  label: React.ReactNode
  onToggle?: () => void
  className?: string
  icon?: 'eye'
}
const Header: React.FC<Props> = ({ label, onToggle, className, icon = 'eye' }) => {
  const IconToRender = Icons[icon]

  return (
    <div className={[classes.header, className].filter(Boolean).join(' ')} data-accordion-header>
      <div className={classes.labelContent} data-accordion-header-content>
        {label}
      </div>

      <CollapsibleToggler
        className={classes.toggler}
        onClick={onToggle}
        data-accordion-header-toggle
      >
        <IconToRender />
      </CollapsibleToggler>
    </div>
  )
}

type ContentProps = {
  children: React.ReactNode
  className?: string
}
const Content: React.FC<ContentProps> = ({ children, className }) => {
  return (
    <CollapsibleContent>
      <div className={[classes.collapsibleContent, className].filter(Boolean).join(' ')}>
        {children}
      </div>
    </CollapsibleContent>
  )
}

export const Accordion = {
  Header,
  Content,
}
