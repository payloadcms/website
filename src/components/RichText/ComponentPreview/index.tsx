'use client'

import Code from '@components/Code'
import { Check, Copy } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useEffect, useId, useRef, useState } from 'react'

import './datePicker.scss'
import { componentExamplesByVersion } from './examples'
import classes from './index.module.scss'

type PreviewTheme = 'dark' | 'light'
type PreviewTab = 'code' | 'design' | 'preview'

type Props = {
  component: string
  example: string
  version?: string
}

const PayloadV4Preview = dynamic(() =>
  import('@payloadcms/v4-preview-runtime').then((module) => module.PayloadV4Preview),
)

export const ComponentPreview: React.FC<Props> = ({ component, example, version }) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('preview')
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

  const previewVersion = version === 'v4' ? 'v4' : 'v3'
  const selectedExample = componentExamplesByVersion[previewVersion][component]?.[example]

  if (!selectedExample) {
    return (
      <div className={classes.unsupported}>
        This component example is not available for{' '}
        {version ? `Payload ${version}` : 'this version'}.
      </div>
    )
  }

  const previewID = `${id}-preview`
  const designID = `${id}-design`
  const codeID = `${id}-code`
  const copyLabel = activeTab === 'design' ? 'Copy CSS' : 'Copy code'
  const isV4Preview = previewVersion === 'v4'

  const copyActiveCode = async () => {
    const code = activeTab === 'design' ? selectedExample.design?.code : selectedExample.code

    if (!code) {
      return
    }

    await navigator.clipboard.writeText(code)
    setCopied(true)
  }

  const switchTab = (nextTab: PreviewTab) => {
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
          {selectedExample.design ? (
            <button
              aria-controls={designID}
              aria-selected={activeTab === 'design'}
              className={classes.tab}
              id={`${id}-design-tab`}
              onClick={() => switchTab('design')}
              role="tab"
              type="button"
            >
              Design
            </button>
          ) : null}
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
              aria-label={copied ? 'Copied' : copyLabel}
              className={classes.copy}
              onClick={copyActiveCode}
              title={copied ? 'Copied' : copyLabel}
              type="button"
            >
              {copied ? (
                <Check aria-hidden="true" size={16} strokeWidth={1.5} />
              ) : (
                <Copy aria-hidden="true" size={16} strokeWidth={1.5} />
              )}
              <span aria-live="polite" className="visually-hidden">
                {copied ? `${activeTab === 'design' ? 'CSS' : 'Code'} copied to clipboard` : ''}
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
          {isV4Preview ? (
            <PayloadV4Preview component={component} example={example} theme={previewTheme} />
          ) : (
            selectedExample.render?.({ theme: previewTheme })
          )}
        </div>
      ) : activeTab === 'design' && selectedExample.design ? (
        <div
          aria-labelledby={`${id}-design-tab`}
          className={[classes.design, isLeaving && classes.leaving].filter(Boolean).join(' ')}
          id={designID}
          role="tabpanel"
        >
          <div className={classes.designFile}>
            Add to <code>app/(payload)/{isV4Preview ? 'custom.css' : 'custom.scss'}</code>
          </div>
          <p className={classes.designDescription}>{selectedExample.design.description}</p>
          <div className={classes.designCode}>
            <Code disableMinHeight language={isV4Preview ? 'css' : 'scss'} showLineNumbers={false}>
              {selectedExample.design.code}
            </Code>
          </div>
          <p className={classes.variableLabel}>What this override changes</p>
          <div className={classes.variables}>
            {selectedExample.design.variables.map((variable) => (
              <div className={classes.variable} key={variable.name}>
                <div className={classes.variableName}>
                  <code>{variable.name}</code>
                </div>
                <p>{variable.description}</p>
              </div>
            ))}
          </div>
          {isV4Preview ? (
            <p className={classes.designNote}>
              Payload 4 places its defaults in <code>@layer payload-default</code>. Put layered
              overrides in <code>@layer payload</code>, and scope tokens under{' '}
              <code>[data-theme='light']</code> or <code>[data-theme='dark']</code> when the themes
              need different values.
            </p>
          ) : (
            <p className={classes.designNote}>
              Scope the selector under <code>html[data-theme='light']</code> or{' '}
              <code>html[data-theme='dark']</code> when the two themes need different values. Prefix
              it with your own class or parent selector to limit the override to one instance or
              Admin view.
            </p>
          )}
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
