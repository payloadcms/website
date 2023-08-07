import * as React from 'react'
import { CollapsibleContent, CollapsibleToggler } from '@faceless-ui/collapsibles'

import { ChevronIcon } from '@root/graphics/ChevronIcon'
import { EyeIcon } from '@root/icons/EyeIcon'

import classes from './index.module.scss'

const Icons = {
  eye: EyeIcon,
  chevron: ChevronIcon,
}

type HeaderProps = {
  label: React.ReactNode
  onToggle?: () => void
  toggleIcon?: 'eye' | 'chevron'
}

const Header: React.FC<HeaderProps> = ({ label, onToggle, toggleIcon = 'eye' }) => {
  const IconToRender = Icons[toggleIcon]

  return (
    <div className={classes.header} data-accordion-header>
      <div className={classes.labelContent} data-accordion-header-content>
        {label}
      </div>

      <CollapsibleToggler
        className={[classes.toggler, classes[`icon--${toggleIcon}`]].filter(Boolean).join(' ')}
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
}
const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <CollapsibleContent>
      <div className={classes.collapsibleContent}>{children}</div>
    </CollapsibleContent>
  )
}

type AccordionProps = HeaderProps &
  ContentProps & {
    className?: string
  }
export const Accordion: React.FC<AccordionProps> = ({ children, className, ...rest }) => {
  return (
    <div className={[classes.accordion, className].filter(Boolean).join(' ')}>
      <Header {...rest} />
      <Content>{children}</Content>
    </div>
  )
}
