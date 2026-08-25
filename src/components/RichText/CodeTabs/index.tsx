'use client'

import type { CodeTabsBlock as CodeTabsBlockType } from '@root/payload-types'

import Code from '@components/Code'
import { CheckIcon } from '@icons/CheckIcon'
import { CopyIcon } from '@icons/CopyIcon'
import * as Tabs from '@radix-ui/react-tabs'
import React from 'react'

import classes from './index.module.scss'

const preferenceEvent = 'payload:code-tab-change'
const preferenceKey = 'payload-docs-code-tab'

export const CodeTabs: React.FC<CodeTabsBlockType> = ({ tabs }) => {
  const [activeTab, setActiveTab] = React.useState(0)
  const [isCopied, setIsCopied] = React.useState(false)

  React.useEffect(() => {
    const selectTab = (label: null | string) => {
      const index = tabs?.findIndex((tab) => tab.label === label) ?? -1

      if (index >= 0) {
        setActiveTab(index)
        setIsCopied(false)
      }
    }

    const handlePreferenceChange = (event: Event) => {
      selectTab((event as CustomEvent<string>).detail)
    }

    selectTab(localStorage.getItem(preferenceKey))
    window.addEventListener(preferenceEvent, handlePreferenceChange)

    return () => window.removeEventListener(preferenceEvent, handlePreferenceChange)
  }, [tabs])

  if (!tabs?.length) {
    return null
  }

  const copyActiveCode = () => {
    void navigator.clipboard.writeText(tabs[activeTab]?.code ?? '')
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1500)
  }

  return (
    <Tabs.Root
      className={classes.root}
      onValueChange={(value) => {
        const index = Number(value)
        const label = tabs[index]?.label

        setActiveTab(index)
        setIsCopied(false)

        if (label) {
          localStorage.setItem(preferenceKey, label)
          window.dispatchEvent(new CustomEvent(preferenceEvent, { detail: label }))
        }
      }}
      value={String(activeTab)}
    >
      <div className={classes.bar}>
        <Tabs.List aria-label="Code examples" className={classes.list}>
          {tabs.map((tab, index) => (
            <Tabs.Trigger className={classes.trigger} key={tab.id ?? index} value={String(index)}>
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
        <Tabs.Content className={classes.content} key={tab.id ?? index} value={String(index)}>
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
