'use client'

import { AnimateHeight } from '@payloadcms/ui/elements/AnimateHeight'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { Button } from '@payloadcms/ui/elements/Button'
import { Card } from '@payloadcms/ui/elements/Card'
import { Collapsible } from '@payloadcms/ui/elements/Collapsible'
import { CopyToClipboard } from '@payloadcms/ui/elements/CopyToClipboard'
import { ErrorPill } from '@payloadcms/ui/elements/ErrorPill'
import { Gutter } from '@payloadcms/ui/elements/Gutter'
import { Hamburger } from '@payloadcms/ui/elements/Hamburger'
import { Pill } from '@payloadcms/ui/elements/Pill'
import { PillSelector, type SelectablePill } from '@payloadcms/ui/elements/PillSelector'
import { ShimmerEffect } from '@payloadcms/ui/elements/ShimmerEffect'
import { Thumbnail } from '@payloadcms/ui/elements/Thumbnail'
import { Tooltip } from '@payloadcms/ui/elements/Tooltip'
import { useTranslation } from '@payloadcms/ui/providers/Translation'
import React, { useState } from 'react'

import classes from './examples.module.scss'

type ComponentExample = {
  code: string
  render: () => React.ReactNode
}

const AnimateHeightDemo = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className={classes.demoPanel}>
      <Button
        buttonStyle="secondary"
        extraButtonProps={{ 'aria-controls': 'details-panel', 'aria-expanded': isOpen }}
        margin={false}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Hide details' : 'Show details'}
      </Button>
      <AnimateHeight height={isOpen ? 'auto' : 0} id="details-panel">
        <div className={classes.animatedContent}>
          This content smoothly expands and collapses without being removed immediately.
        </div>
      </AnimateHeight>
    </div>
  )
}

const PillSelectorDemo = () => {
  const [pills, setPills] = useState<SelectablePill[]>([
    { name: 'Posts', selected: true },
    { name: 'Media', selected: false },
    { name: 'Users', selected: true },
  ])

  return (
    <PillSelector
      onClick={({ pill }) => {
        setPills((current) =>
          current.map((item) =>
            item.name === pill.name ? { ...item, selected: !item.selected } : item,
          ),
        )
      }}
      pills={pills}
    />
  )
}

const ErrorPillDemo = () => {
  const { i18n } = useTranslation()

  return (
    <div className={classes.row}>
      <ErrorPill count={1} i18n={i18n} />
      <ErrorPill count={12} i18n={i18n} />
      <ErrorPill count={120} i18n={i18n} />
    </div>
  )
}

const TooltipDemo = () => {
  const [show, setShow] = useState(false)

  return (
    <div className={classes.tooltipTarget}>
      <Button
        buttonStyle="secondary"
        extraButtonProps={{
          onBlur: () => setShow(false),
          onFocus: () => setShow(true),
          onMouseEnter: () => setShow(true),
          onMouseLeave: () => setShow(false),
        }}
        margin={false}
      >
        Hover or focus
      </Button>
      <Tooltip delay={0} position="top" show={show} staticPositioning>
        Helpful context
      </Tooltip>
    </div>
  )
}

export const componentExamples: Record<string, Record<string, ComponentExample>> = {
  AnimateHeight: {
    interactive: {
      code: `const [isOpen, setIsOpen] = useState(true)

<Button
  buttonStyle="secondary"
  extraButtonProps={{ 'aria-controls': 'details-panel', 'aria-expanded': isOpen }}
  margin={false}
  onClick={() => setIsOpen(!isOpen)}
>
  {isOpen ? 'Hide details' : 'Show details'}
</Button>
<AnimateHeight height={isOpen ? 'auto' : 0} id="details-panel">
  <div>Expandable content</div>
</AnimateHeight>`,
      render: () => <AnimateHeightDemo />,
    },
  },
  Banner: {
    basic: {
      code: `<Banner>Changes saved successfully.</Banner>`,
      render: () => (
        <div className={classes.stack}>
          <Banner>Changes saved successfully.</Banner>
        </div>
      ),
    },
    variants: {
      code: `<Banner type="default">Default message</Banner>
<Banner type="success">Changes saved successfully.</Banner>
<Banner type="info">Additional context is available.</Banner>
<Banner type="error">Something went wrong.</Banner>`,
      render: () => (
        <div className={classes.stack}>
          <Banner type="default">Default message</Banner>
          <Banner type="success">Changes saved successfully.</Banner>
          <Banner type="info">Additional context is available.</Banner>
          <Banner type="error">Something went wrong.</Banner>
        </div>
      ),
    },
  },
  Button: {
    disabled: {
      code: `<Button disabled margin={false}>Save changes</Button>`,
      render: () => (
        <Button disabled margin={false}>
          Save changes
        </Button>
      ),
    },
    primary: {
      code: `<Button margin={false}>Save changes</Button>`,
      render: () => <Button margin={false}>Save changes</Button>,
    },
    sizes: {
      code: `<Button margin={false} size="xsmall">Extra small</Button>
<Button margin={false} size="small">Small</Button>
<Button margin={false} size="medium">Medium</Button>
<Button margin={false} size="large">Large</Button>`,
      render: () => (
        <div className={classes.row}>
          <Button margin={false} size="xsmall">
            Extra small
          </Button>
          <Button margin={false} size="small">
            Small
          </Button>
          <Button margin={false} size="medium">
            Medium
          </Button>
          <Button margin={false} size="large">
            Large
          </Button>
        </div>
      ),
    },
    styles: {
      code: `<Button margin={false}>Primary</Button>
<Button buttonStyle="secondary" margin={false}>Secondary</Button>
<Button buttonStyle="error" margin={false}>Delete</Button>`,
      render: () => (
        <div className={classes.row}>
          <Button margin={false}>Primary</Button>
          <Button buttonStyle="secondary" margin={false}>
            Secondary
          </Button>
          <Button buttonStyle="error" margin={false}>
            Delete
          </Button>
        </div>
      ),
    },
  },
  Card: {
    actions: {
      code: `<Card
  actions={<Button buttonStyle="secondary" margin={false} size="small">Edit</Button>}
  title="Posts"
/>`,
      render: () => (
        <div className={classes.componentWidth}>
          <Card
            actions={
              <Button buttonStyle="secondary" margin={false} size="small">
                Edit
              </Button>
            }
            title="Posts"
          />
        </div>
      ),
    },
    basic: {
      code: `<Card title="Posts" />`,
      render: () => (
        <div className={classes.componentWidth}>
          <Card title="Posts" />
        </div>
      ),
    },
  },
  Collapsible: {
    basic: {
      code: `<Collapsible header="Collapsible header">
  Add fields or other content here.
</Collapsible>`,
      render: () => (
        <div className={classes.collapsibleDemo}>
          <Collapsible header="Collapsible header">Add fields or other content here.</Collapsible>
        </div>
      ),
    },
    error: {
      code: `<Collapsible collapsibleStyle="error" header="Collapsible header">
  Correct the invalid fields in this section.
</Collapsible>`,
      render: () => (
        <div className={classes.collapsibleDemo}>
          <Collapsible collapsibleStyle="error" header="Collapsible header">
            Correct the invalid fields in this section.
          </Collapsible>
        </div>
      ),
    },
  },
  CopyToClipboard: {
    basic: {
      code: `<span>post_123456789</span>
<CopyToClipboard
  defaultMessage="Copy ID"
  successMessage="ID copied"
  value="post_123456789"
/>`,
      render: () => (
        <div className={classes.copyDemo}>
          <code>post_123456789</code>
          <CopyToClipboard
            defaultMessage="Copy ID"
            successMessage="ID copied"
            value="post_123456789"
          />
        </div>
      ),
    },
  },
  ErrorPill: {
    counts: {
      code: `const { i18n } = useTranslation()

<ErrorPill count={1} i18n={i18n} />
<ErrorPill count={12} i18n={i18n} />
<ErrorPill count={120} i18n={i18n} />`,
      render: () => <ErrorPillDemo />,
    },
  },
  Gutter: {
    basic: {
      code: `<Gutter>
  <div>Content aligned to the Admin Panel gutter</div>
</Gutter>`,
      render: () => (
        <div className={classes.gutterFrame}>
          <Gutter>
            <div className={classes.gutterContent}>Content aligned to the Admin Panel gutter</div>
          </Gutter>
        </div>
      ),
    },
  },
  Hamburger: {
    states: {
      code: `<Hamburger />
<Hamburger isActive />
<Hamburger closeIcon="collapse" isActive />`,
      render: () => (
        <div className={classes.iconStates}>
          <div className={classes.iconState}>
            <Hamburger />
            <span>Closed</span>
          </div>
          <div className={classes.iconState}>
            <Hamburger isActive />
            <span>Open</span>
          </div>
          <div className={classes.iconState}>
            <Hamburger closeIcon="collapse" isActive />
            <span>Collapse</span>
          </div>
        </div>
      ),
    },
  },
  Pill: {
    shapes: {
      code: `<Pill>Default</Pill>
<Pill rounded>Rounded</Pill>`,
      render: () => (
        <div className={classes.row}>
          <Pill>Default</Pill>
          <Pill rounded>Rounded</Pill>
        </div>
      ),
    },
    sizes: {
      code: `<Pill size="small">Small</Pill>
<Pill size="medium">Medium</Pill>`,
      render: () => (
        <div className={classes.row}>
          <Pill size="small">Small</Pill>
          <Pill size="medium">Medium</Pill>
        </div>
      ),
    },
    styles: {
      code: `<Pill>Default</Pill>
<Pill pillStyle="dark">Dark</Pill>
<Pill pillStyle="success">Success</Pill>
<Pill pillStyle="warning">Warning</Pill>
<Pill pillStyle="error">Error</Pill>`,
      render: () => (
        <div className={classes.row}>
          <Pill>Default</Pill>
          <Pill pillStyle="dark">Dark</Pill>
          <Pill pillStyle="success">Success</Pill>
          <Pill pillStyle="warning">Warning</Pill>
          <Pill pillStyle="error">Error</Pill>
        </div>
      ),
    },
  },
  PillSelector: {
    interactive: {
      code: `const [pills, setPills] = useState([
  { name: 'Posts', selected: true },
  { name: 'Media', selected: false },
])

<PillSelector
  pills={pills}
  onClick={({ pill }) => {
    setPills(current => current.map(item =>
      item.name === pill.name ? { ...item, selected: !item.selected } : item
    ))
  }}
/>`,
      render: () => <PillSelectorDemo />,
    },
  },
  ShimmerEffect: {
    basic: {
      code: `<ShimmerEffect height={60} width="100%" />`,
      render: () => (
        <div className={classes.componentWidth}>
          <ShimmerEffect height={60} width="100%" />
        </div>
      ),
    },
    shapes: {
      code: `<ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
<ShimmerEffect height={16} width="75%" />
<ShimmerEffect height={16} width="50%" />`,
      render: () => (
        <div className={classes.skeletonLayout}>
          <ShimmerEffect height={48} style={{ borderRadius: '50%' }} width={48} />
          <div className={classes.skeletonLines}>
            <ShimmerEffect height={16} width="75%" />
            <ShimmerEffect height={16} width="50%" />
          </div>
        </div>
      ),
    },
  },
  Thumbnail: {
    fallback: {
      code: `<Thumbnail size="medium" />`,
      render: () => <Thumbnail size="medium" />,
    },
    sizes: {
      code: `<Thumbnail size="small" />
<Thumbnail size="medium" />
<Thumbnail size="large" />`,
      render: () => (
        <div className={classes.row}>
          <Thumbnail size="small" />
          <Thumbnail size="medium" />
          <Thumbnail size="large" />
        </div>
      ),
    },
  },
  Tooltip: {
    interactive: {
      code: `const [show, setShow] = useState(false)

<div style={{ position: 'relative' }}>
  <Button
    buttonStyle="secondary"
    extraButtonProps={{
      onBlur: () => setShow(false),
      onFocus: () => setShow(true),
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false),
    }}
    margin={false}
  >
    Hover or focus
  </Button>
  <Tooltip delay={0} position="top" show={show} staticPositioning>
    Helpful context
  </Tooltip>
</div>`,
      render: () => <TooltipDemo />,
    },
  },
}
