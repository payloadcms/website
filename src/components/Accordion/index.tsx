'use client'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleToggler,
  useCollapsible,
} from '@faceless-ui/collapsibles'
import { ChevronIcon } from '@root/graphics/ChevronIcon/index'
import { EyeIcon } from '@root/icons/EyeIcon/index'
import * as React from 'react'

import classes from './index.module.scss'

const Icons = {
  chevron: ChevronIcon,
  eye: EyeIcon,
}

const IconToRender: React.FC<{ icon: 'chevron' | 'eye' }> = ({ icon }) => {
  const { isOpen } = useCollapsible()

  if (icon === 'eye') {
    return <EyeIcon closed={isOpen} size="large" />
  }

  const Icon = Icons[icon]
  return <Icon />
}

type HeaderProps = {
  label: React.ReactNode
  toggleIcon?: 'chevron' | 'eye'
}

const Header: React.FC<HeaderProps> = ({ label, toggleIcon = 'chevron' }) => {
  return (
    <CollapsibleToggler className={classes.toggler}>
      <div className={classes.labelContent}>{label}</div>
      <div className={[classes.icon, classes[`icon--${toggleIcon}`]].filter(Boolean).join(' ')}>
        <IconToRender icon={toggleIcon} />
      </div>
    </CollapsibleToggler>
  )
}

type ContentProps = {
  children: React.ReactNode
}
const Content: React.FC<ContentProps> = ({ children }) => {
  return (
    <CollapsibleContent>
      <div className={classes.collapsibleContent} data-accordion-content>
        {children}
      </div>
    </CollapsibleContent>
  )
}

type AccordionProps = {
  className?: string
  onToggle?: () => void
  openOnInit?: boolean
} & ContentProps &
  HeaderProps

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  onToggle,
  openOnInit,
  ...rest
}) => {
  return (
    <Collapsible
      onToggle={() => {
        if (typeof onToggle === 'function') {
          onToggle()
        }
      }}
      openOnInit={openOnInit}
      transCurve="ease"
      transTime={250}
    >
      <div className={[classes.accordion, className].filter(Boolean).join(' ')}>
        <Header {...rest} />
        <Content>{children}</Content>
      </div>
    </Collapsible>
  )
}
