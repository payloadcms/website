'use client'

import { Checkbox } from '@forms/fields/Checkbox/index'
import { Number as NumberField } from '@forms/fields/Number/index'
import React, { useState } from 'react'

import classes from '../page.module.scss'

export const StepCareOn: React.FC = () => {
  const [careOnSubscribed, setCareOnSubscribed] = useState(false)

  return (
    <div className={classes.careOnSection}>
      <div className={classes.careOnBenefit}>
        <h3>CareOn 연동 혜택</h3>
        <ul>
          <li>웹사이트 + 블로그 무료 제공</li>
          <li>자동 블로그 포스팅 (SEO 최적화)</li>
          <li>CCTV 실시간 모니터링</li>
          <li>POS 매출 분석 대시보드</li>
          <li>모바일 앱 알림</li>
        </ul>
      </div>

      <div className={classes.careOnOptions}>
        <div
          className={[classes.careOnCard, careOnSubscribed && classes.selected]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setCareOnSubscribed(true)}
        >
          <h4>CareOn 구독</h4>
          <p className={classes.price}>무료</p>
          <p className={classes.priceNote}>하드웨어 구독 포함 시</p>
          <p style={{ marginTop: 'calc(var(--base))', fontSize: '0.875rem' }}>
            CCTV + POS 연동으로<br />
            모든 기능 무료 사용
          </p>
        </div>

        <div
          className={[classes.careOnCard, !careOnSubscribed && classes.selected]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setCareOnSubscribed(false)}
        >
          <h4>일반 가입</h4>
          <p className={classes.price}>₩29,000/월</p>
          <p className={classes.priceNote}>CareOn 연동 없음</p>
          <p style={{ marginTop: 'calc(var(--base))', fontSize: '0.875rem' }}>
            웹사이트 + 블로그<br />
            기본 기능만 사용
          </p>
        </div>
      </div>

      <input type="hidden" name="careOnSubscribed" value={careOnSubscribed.toString()} />

      {careOnSubscribed && (
        <div style={{ marginTop: 'calc(var(--base) * 2)', textAlign: 'left' }}>
          <h4 style={{ marginBottom: 'calc(var(--base))' }}>CareOn 설정</h4>
          <div className={classes.fieldGroup}>
            <NumberField
              label="CCTV 대수"
              path="cctvCount"
              placeholder="4"
            />
            <div>
              <Checkbox label="POS 연동" path="posConnected" />
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--theme-elevation-600)' }}>
            * CareOn 담당자가 설치 일정을 안내드립니다.
          </p>
        </div>
      )}
    </div>
  )
}
