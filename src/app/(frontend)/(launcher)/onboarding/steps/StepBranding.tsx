'use client'

import { Text } from '@forms/fields/Text/index'
import { RadioGroup } from '@forms/fields/RadioGroup/index'
import React from 'react'

import classes from '../page.module.scss'

const VIBE_OPTIONS = [
  { label: '친근한/캐주얼', value: 'casual' },
  { label: '고급스러운/프리미엄', value: 'premium' },
  { label: '전통적인/정통', value: 'traditional' },
  { label: '모던/트렌디', value: 'modern' },
  { label: '아기자기한/귀여운', value: 'cute' },
  { label: '힙한/개성있는', value: 'hipster' },
]

export const StepBranding: React.FC = () => {
  return (
    <div>
      <h3 className={classes.sectionTitle}>브랜드 스타일</h3>
      <p style={{ marginBottom: 'calc(var(--base) * 1.5)', color: 'var(--theme-elevation-600)' }}>
        가게의 분위기와 색상을 선택해주세요. 웹사이트 디자인에 반영됩니다.
      </p>

      <div style={{ marginBottom: 'calc(var(--base) * 2)' }}>
        <RadioGroup
          label="가게 분위기"
          path="vibe"
          options={VIBE_OPTIONS}
          required
        />
      </div>

      <div className={classes.fieldGroup}>
        <div className={classes.colorPicker}>
          <Text
            label="메인 컬러"
            path="primaryColor"
            placeholder="#FF5733"
          />
        </div>

        <div className={classes.colorPicker}>
          <Text
            label="보조 컬러"
            path="secondaryColor"
            placeholder="#333333"
          />
        </div>

        <div className={classes.fullWidth}>
          <Text
            label="슬로건/캐치프레이즈"
            path="slogan"
            placeholder="예: 정성을 담아 굽습니다"
          />
        </div>
      </div>
    </div>
  )
}
