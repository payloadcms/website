'use client'

import React, { useState } from 'react'

import { RichText } from '@components/RichText'
import { ExampleTabsBlock } from '@root/payload-types'
import { Examples } from '../Examples'

type Props = Pick<ExampleTabsBlock, 'tabs'>

import classes from './index.module.scss'

export const Tabs: React.FC<Props> = props => {
  const { tabs } = props
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className={classes.tabsContainer}>
      <nav className={classes.tabNavigation}>
        {tabs &&
          tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={i === activeTab ? classes.active : ''}
            >
              {tab.label}
            </button>
          ))}
      </nav>
      {tabs && <RichText content={tabs[activeTab].content} className={classes.content} />}
      {tabs && <Examples examples={tabs[activeTab].examples} />}
    </div>
  )
}
