import { PayloadIcon } from '@payloadcms/ui'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const stepNavigationExamples: ComponentExamples = {
  customView: {
    code: `const stepNav = [
  { label: 'Orders', url: '/admin/collections/orders' },
  { label: 'Order #1042' },
]

export function OrderView() {
  return (
    <>
      <SetStepNav nav={stepNav} />
      <Gutter>
        <h1>Order #1042</h1>
      </Gutter>
    </>
  )
}`,
    design: {
      code: `.step-nav {
  gap: 0.75rem;
}

.step-nav a {
  color: #6d5dfc;
  text-decoration-color: #b8adff;
}`,
      description:
        'Target the existing StepNav in your Admin Panel stylesheet to adjust breadcrumb spacing and linked-item treatment across Custom Views.',
      variables: [
        {
          name: 'gap',
          description: 'Space between the home link, separators, and breadcrumb items.',
        },
        {
          name: 'color',
          description: 'Linked breadcrumb text and inherited icon color.',
        },
        {
          name: 'text-decoration-color',
          description: 'Underline color shown when a breadcrumb link is hovered or focused.',
        },
      ],
    },
    render: () => (
      <div className={classes.stepNavDemo}>
        <nav className="step-nav">
          <a className="step-nav__home" href="#step-navigation-preview" tabIndex={0}>
            <span title="Dashboard">
              <PayloadIcon />
            </span>
          </a>
          <span>/</span>
          <a href="#step-navigation-preview">
            <span>Orders</span>
          </a>
          <span>/</span>
          <span className="step-nav__last">Order #1042</span>
        </nav>
      </div>
    ),
  },
}
