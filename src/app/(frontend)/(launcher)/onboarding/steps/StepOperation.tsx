'use client'

import { Text } from '@forms/fields/Text/index'
import { Checkbox } from '@forms/fields/Checkbox/index'
import React from 'react'

import classes from '../page.module.scss'

export const StepOperation: React.FC = () => {
  return (
    <div>
      <h3 className={classes.sectionTitle}>운영 정보</h3>
      <p style={{ marginBottom: 'calc(var(--base) * 1.5)', color: 'var(--theme-elevation-600)' }}>
        손님들이 가게를 찾아올 수 있도록 위치와 영업 정보를 입력해주세요.
      </p>

      <div className={classes.fieldGroup}>
        <div className={classes.fullWidth}>
          <Text
            label="주소"
            path="address"
            placeholder="예: 서울시 강남구 테헤란로 123"
            required
          />
        </div>

        <Text
          label="상세주소"
          path="addressDetail"
          placeholder="예: 2층"
        />

        <Text
          label="영업시간"
          path="businessHours"
          placeholder="예: 11:00 - 22:00"
        />

        <Text
          label="휴무일"
          path="closedDays"
          placeholder="예: 매주 월요일"
        />
      </div>

      <h4 style={{ marginTop: 'calc(var(--base) * 2)', marginBottom: 'calc(var(--base))' }}>
        편의시설
      </h4>

      <div className={classes.featureGrid}>
        <Checkbox label="배달 가능" path="features.delivery" />
        <Checkbox label="예약 가능" path="features.reservation" />
        <Checkbox label="주차 가능" path="features.parking" />
        <Checkbox label="WiFi" path="features.wifi" />
        <Checkbox label="반려동물 동반" path="features.petFriendly" />
        <Checkbox label="키즈존" path="features.kidsZone" />
      </div>
    </div>
  )
}
