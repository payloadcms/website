'use client'

import * as React from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleToggler,
  useCollapsible,
} from '@faceless-ui/collapsibles'

import { ChevronIcon } from '@root/graphics/ChevronIcon/index.js'
import { EyeIcon } from '@root/icons/EyeIcon/index.js'

import classes from './index.module.scss'

const Icons = {
  eye: EyeIcon,
  chevron: ChevronIcon,
}

const IconToRender: React.FC<{ icon: 'eye' | 'chevron' }> = ({ icon }) => {
  const { isOpen } = useCollapsible()

  if (icon === 'eye') {
    return <EyeIcon closed={isOpen} size="large" />
  }

  const Icon = Icons[icon]
  return <Icon />
}

type HeaderProps = {
  label: React.ReactNode
  toggleIcon?: 'eye' | 'chevron'
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

type AccordionProps = HeaderProps &
  ContentProps & {
    className?: string
    openOnInit?: boolean
    onToggle?: () => void
  }

export const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  openOnInit,
  onToggle,
  ...rest
}) => {
  return (
    <Collapsible
      openOnInit={openOnInit}
      transTime={250}
      transCurve="ease"
      onToggle={() => {
        if (typeof onToggle === 'function') {
          onToggle()
        }
      }}
    >
      <div className={[classes.accordion, className].filter(Boolean).join(' ')}>
        <Header {...rest} />
        <Content>{children}</Content>
      </div>
    </Collapsible>
  )
}
