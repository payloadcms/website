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
          description: 'Linked breadcrumb text color.',
        },
        {
          name: 'text-decoration-color',
          description: 'Underline color shown when a breadcrumb link is hovered or focused.',
        },
      ],
    },
    render: () => (
      <div className={classes.stepNavDemo}>
        <nav aria-label="Breadcrumb" className="step-nav">
          <a className="step-nav__item step-nav__first" href="#step-navigation-preview">
            Dashboard
          </a>
          <span className="step-nav__separator">/</span>
          <a className="step-nav__item" href="#step-navigation-preview">
            Orders
          </a>
          <span className="step-nav__separator">/</span>
          <span aria-current="page" className="step-nav__item step-nav__last">
            Order #1042
          </span>
        </nav>
      </div>
    ),
  },
}
