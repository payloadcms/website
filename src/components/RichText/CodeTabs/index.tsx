'use client'

import type { CodeTabsBlock as CodeTabsBlockType } from '@root/payload-types'

import Code from '@components/Code'
import { CheckIcon } from '@icons/CheckIcon'
import { CopyIcon } from '@icons/CopyIcon'
import * as Tabs from '@radix-ui/react-tabs'
import React from 'react'

import classes from './index.module.scss'

export const CodeTabs: React.FC<CodeTabsBlockType> = ({ tabs }) => {
  const tabValues = React.useMemo(
    () => tabs?.map((tab, index) => tab.id || `code-tab-${index}`) ?? [],
    [tabs],
  )
  const [activeTab, setActiveTab] = React.useState(tabValues[0] ?? '')
  const [isCopied, setIsCopied] = React.useState(false)
  const copyTimeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  React.useEffect(() => {
    if (!tabValues.includes(activeTab)) {
      setActiveTab(tabValues[0] ?? '')
    }
  }, [activeTab, tabValues])

  React.useEffect(
    () => () => {
      clearTimeout(copyTimeout.current)
    },
    [],
  )

  if (!tabs?.length) {
    return null
  }

  const activeTabIndex = tabValues.indexOf(activeTab)
  const activeCode = tabs[activeTabIndex]?.code ?? ''

  const copyActiveCode = async () => {
    await navigator.clipboard.writeText(activeCode)
    setIsCopied(true)
    clearTimeout(copyTimeout.current)
    copyTimeout.current = setTimeout(() => setIsCopied(false), 1500)
  }

  return (
    <Tabs.Root
      className={classes.root}
      onValueChange={(value) => {
        setActiveTab(value)
        setIsCopied(false)
      }}
      value={activeTab}
    >
      <div className={classes.bar}>
        <Tabs.List aria-label="Code examples" className={classes.list}>
          {tabs.map((tab, index) => (
            <Tabs.Trigger
              className={classes.trigger}
              key={tabValues[index]}
              value={tabValues[index]}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <button
          aria-label={isCopied ? 'Copied code' : 'Copy code to clipboard'}
          className={classes.copyButton}
          onClick={copyActiveCode}
          title={isCopied ? 'Copied' : 'Copy code'}
          type="button"
        >
          {isCopied ? <CheckIcon size="large" /> : <CopyIcon size="large" />}
        </button>
      </div>
      {tabs.map((tab, index) => (
        <Tabs.Content className={classes.content} key={tabValues[index]} value={tabValues[index]}>
          <Code
            children={tab.code ?? ''}
            disableMinHeight
            language={tab.language ?? undefined}
            parentClassName={classes.code}
          />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
