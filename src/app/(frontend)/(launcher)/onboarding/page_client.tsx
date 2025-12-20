'use client'

import { Gutter } from '@components/Gutter/index'
import { Heading } from '@components/Heading/index'
import Form from '@forms/Form/index'
import FormSubmissionError from '@forms/FormSubmissionError/index'
import Submit from '@forms/Submit/index'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'

import {
  StepBasicInfo,
  StepBranding,
  StepMenu,
  StepOperation,
  StepCareOn,
} from './steps'
import { ProgressIndicator } from './components/ProgressIndicator'

import classes from './page.module.scss'

export type OnboardingStep = 1 | 2 | 3 | 4 | 5

export interface OnboardingData {
  // Step 1: Basic Info (가면의 질문)
  businessName: string
  businessType: string
  ownerName: string
  phone: string
  email: string

  // Step 2: Branding
  vibe: string
  primaryColor: string
  secondaryColor: string
  slogan: string
  logoFile?: File | null

  // Step 3: Menu & Target
  targetCustomer: string
  signatureMenu: Array<{
    name: string
    price: number
    description: string
  }>

  // Step 4: Operation (목마의 질문)
  address: string
  addressDetail: string
  businessHours: string
  closedDays: string
  features: {
    delivery: boolean
    reservation: boolean
    parking: boolean
    wifi: boolean
    petFriendly: boolean
    kidsZone: boolean
  }

  // Step 5: CareOn (학살의 질문)
  careOnSubscribed: boolean
  cctvCount: number
  posConnected: boolean
}

const STEP_TITLES: Record<OnboardingStep, string> = {
  1: '가게 정보',
  2: '브랜드 스타일',
  3: '메뉴 & 타겟',
  4: '운영 정보',
  5: 'CareOn 연동',
}

const STEP_DESCRIPTIONS: Record<OnboardingStep, string> = {
  1: '어떤 가게인지 알려주세요',
  2: '가게의 분위기를 선택해주세요',
  3: '자랑할 메뉴를 알려주세요',
  4: '손님들이 찾아올 수 있도록',
  5: '무료 혜택을 받으세요',
}

export const OnboardingWizard: React.FC = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = useCallback(() => {
    if (currentStep < 5) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep)
    }
  }, [currentStep])

  const handlePrev = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as OnboardingStep)
    }
  }, [currentStep])

  const handleSubmit = useCallback(
    async ({ unflattenedData }: { unflattenedData: OnboardingData }) => {
      if (currentStep < 5) {
        handleNext()
        return
      }

      setIsSubmitting(true)
      setError(null)

      try {
        // TODO: Submit to API
        const response = await fetch('/api/launcher/onboarding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(unflattenedData),
        })

        if (!response.ok) {
          throw new Error('사이트 생성에 실패했습니다.')
        }

        const result = await response.json()
        toast.success('사이트가 생성되었습니다!')
        router.push(`/launcher/dashboard/${result.slug}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        setError(msg)
        toast.error(msg)
      } finally {
        setIsSubmitting(false)
      }
    },
    [currentStep, handleNext, router],
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepBasicInfo />
      case 2:
        return <StepBranding />
      case 3:
        return <StepMenu />
      case 4:
        return <StepOperation />
      case 5:
        return <StepCareOn />
      default:
        return null
    }
  }

  return (
    <div className={classes.wizard}>
      <Gutter>
        <div className={classes.header}>
          <Heading as="h1" element="h1" marginTop={false}>
            {STEP_TITLES[currentStep]}
          </Heading>
          <p className={classes.description}>{STEP_DESCRIPTIONS[currentStep]}</p>
        </div>

        <ProgressIndicator currentStep={currentStep} totalSteps={5} />

        <Form onSubmit={handleSubmit}>
          <FormSubmissionError />
          {error && <div className={classes.error}>{error}</div>}

          <div className={classes.stepContent}>{renderStep()}</div>

          <div className={classes.navigation}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className={classes.prevButton}
                disabled={isSubmitting}
              >
                이전
              </button>
            )}
            <Submit
              appearance="primary"
              label={currentStep === 5 ? '사이트 생성하기' : '다음'}
              disabled={isSubmitting}
            />
          </div>
        </Form>
      </Gutter>
    </div>
  )
}
