'use client'

import React from 'react'

import classes from './index.module.scss'

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
}

const STEP_LABELS = ['가게 정보', '브랜딩', '메뉴', '운영', 'CareOn']

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className={classes.progress}>
      <div className={classes.steps}>
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div
            key={step}
            className={[
              classes.step,
              step === currentStep && classes.active,
              step < currentStep && classes.completed,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={classes.stepNumber}>
              {step < currentStep ? '✓' : step}
            </div>
            <span className={classes.stepLabel}>{STEP_LABELS[step - 1]}</span>
          </div>
        ))}
      </div>
      <div className={classes.progressBar}>
        <div
          className={classes.progressFill}
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
