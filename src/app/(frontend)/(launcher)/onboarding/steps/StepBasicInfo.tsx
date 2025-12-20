'use client'

import { Select } from '@forms/fields/Select/index'
import { Text } from '@forms/fields/Text/index'
import React from 'react'

import classes from '../page.module.scss'

const BUSINESS_TYPE_OPTIONS = [
  { label: '고기집/정육점', value: 'meat' },
  { label: '카페/디저트', value: 'cafe' },
  { label: '한식', value: 'korean' },
  { label: '일식', value: 'japanese' },
  { label: '중식', value: 'chinese' },
  { label: '양식', value: 'western' },
  { label: '치킨/피자', value: 'chicken_pizza' },
  { label: '분식', value: 'snack' },
  { label: '베이커리', value: 'bakery' },
  { label: '프랜차이즈 본사', value: 'franchise_hq' },
  { label: '기타 요식업', value: 'other_food' },
  { label: '소매업', value: 'retail' },
  { label: '서비스업', value: 'service' },
  { label: '기타', value: 'other' },
]

export const StepBasicInfo: React.FC = () => {
  return (
    <div>
      <h3 className={classes.sectionTitle}>기본 정보</h3>
      <p style={{ marginBottom: 'calc(var(--base) * 1.5)', color: 'var(--theme-elevation-600)' }}>
        가게의 기본 정보를 입력해주세요. 이 정보는 웹사이트 생성에 사용됩니다.
      </p>

      <div className={classes.fieldGroup}>
        <div className={classes.fullWidth}>
          <Text
            label="상호명"
            path="businessName"
            placeholder="예: 맛있는 고기집"
            required
          />
        </div>

        <Select
          label="업종"
          path="businessType"
          options={BUSINESS_TYPE_OPTIONS}
          required
        />

        <Text
          label="대표자명"
          path="ownerName"
          placeholder="홍길동"
        />

        <Text
          label="연락처"
          path="phone"
          placeholder="010-1234-5678"
        />

        <Text
          label="이메일"
          path="email"
          placeholder="example@email.com"
        />
      </div>
    </div>
  )
}
