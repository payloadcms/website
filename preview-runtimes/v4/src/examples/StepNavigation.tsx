import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
export const stepNavigationExamples: ComponentRenders = {
  customView: {
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
