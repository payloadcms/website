'use client'

import Code from '@components/Code'
import { Check, Copy } from 'lucide-react'
import React, { useEffect, useId, useRef, useState } from 'react'

import { componentExamples } from './examples'
import classes from './index.module.scss'

type PreviewTheme = 'dark' | 'light'

type Props = {
  component: string
  example: string
  version?: string
}

export const ComponentPreview: React.FC<Props> = ({ component, example, version }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('preview')
  const [copied, setCopied] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('light')
  const id = useId()
  const transitionTimeout = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => window.clearTimeout(transitionTimeout.current)
  }, [])

  useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(timeout)
  }, [copied])

  const selectedExample = componentExamples[component]?.[example]

  if (!selectedExample) {
    return (
      <div className={classes.unsupported}>
        This component example is not available for{' '}
        {version ? `Payload ${version}` : 'this version'}.
      </div>
    )
  }

  const previewID = `${id}-preview`
  const codeID = `${id}-code`

  const copyCode = async () => {
    await navigator.clipboard.writeText(selectedExample.code)
    setCopied(true)
  }

  const switchTab = (nextTab: 'code' | 'preview') => {
    if (nextTab === activeTab || isLeaving) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveTab(nextTab)
      return
    }

    setIsLeaving(true)
    transitionTimeout.current = window.setTimeout(() => {
      setActiveTab(nextTab)
      setIsLeaving(false)
    }, 60)
  }

  return (
    <section className={classes.preview}>
      <div className={classes.toolbar}>
        <div aria-label="Component example view" className={classes.tabs} role="tablist">
          <button
            aria-controls={previewID}
            aria-selected={activeTab === 'preview'}
            className={classes.tab}
            id={`${id}-preview-tab`}
            onClick={() => switchTab('preview')}
            role="tab"
            type="button"
          >
            Preview
          </button>
          <button
            aria-controls={codeID}
            aria-selected={activeTab === 'code'}
            className={classes.tab}
            id={`${id}-code-tab`}
            onClick={() => switchTab('code')}
            role="tab"
            type="button"
          >
            Code
          </button>
        </div>
        <div className={classes.actions}>
          {activeTab === 'preview' ? (
            <div aria-label="Preview theme" className={classes.themeToggle} role="group">
              {(['light', 'dark'] as const).map((theme) => (
                <button
                  aria-pressed={previewTheme === theme}
                  className={classes.themeButton}
                  key={theme}
                  onClick={() => setPreviewTheme(theme)}
                  type="button"
                >
                  {theme === 'light' ? 'Light' : 'Dark'}
                </button>
              ))}
            </div>
          ) : (
            <button
              aria-label={copied ? 'Copied' : 'Copy code'}
              className={classes.copy}
              onClick={copyCode}
              title={copied ? 'Copied' : 'Copy code'}
              type="button"
            >
              {copied ? (
                <Check aria-hidden="true" size={16} strokeWidth={1.5} />
              ) : (
                <Copy aria-hidden="true" size={16} strokeWidth={1.5} />
              )}
              <span aria-live="polite" className="visually-hidden">
                {copied ? 'Code copied to clipboard' : ''}
              </span>
            </button>
          )}
        </div>
      </div>
      {activeTab === 'preview' ? (
        <div
          aria-labelledby={`${id}-preview-tab`}
          className={[classes.canvas, isLeaving && classes.leaving].filter(Boolean).join(' ')}
          data-theme={previewTheme}
          id={previewID}
          role="tabpanel"
        >
          {selectedExample.render()}
        </div>
      ) : (
        <div
          aria-labelledby={`${id}-code-tab`}
          className={[classes.code, isLeaving && classes.leaving].filter(Boolean).join(' ')}
          id={codeID}
          role="tabpanel"
        >
          <Code disableMinHeight language="tsx" showLineNumbers={false}>
            {selectedExample.code}
          </Code>
        </div>
      )}
    </section>
  )
}
