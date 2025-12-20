'use client'

import { Text } from '@forms/fields/Text/index'
import { Textarea } from '@forms/fields/Textarea/index'
import { Number as NumberField } from '@forms/fields/Number/index'
import React, { useState } from 'react'

import classes from '../page.module.scss'

interface MenuItem {
  id: string
  name: string
  price: number
  description: string
}

export const StepMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: '1', name: '', price: 0, description: '' },
  ])

  const addMenuItem = () => {
    setMenuItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: '', price: 0, description: '' },
    ])
  }

  const removeMenuItem = (id: string) => {
    if (menuItems.length > 1) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div>
      <h3 className={classes.sectionTitle}>메뉴 & 타겟 고객</h3>
      <p style={{ marginBottom: 'calc(var(--base) * 1.5)', color: 'var(--theme-elevation-600)' }}>
        자랑하고 싶은 시그니처 메뉴를 알려주세요. 웹사이트에 멋지게 소개됩니다.
      </p>

      <div style={{ marginBottom: 'calc(var(--base) * 2)' }}>
        <Textarea
          label="타겟 고객"
          path="targetCustomer"
          placeholder="예: 30-40대 직장인, 가족 단위 손님, 회식 모임"
        />
      </div>

      <h4 style={{ marginBottom: 'calc(var(--base))' }}>시그니처 메뉴</h4>

      <div className={classes.menuList}>
        {menuItems.map((item, index) => (
          <div key={item.id} className={classes.menuItem}>
            <Text
              label={`메뉴명 ${index + 1}`}
              path={`signatureMenu.${index}.name`}
              placeholder="예: 한우 등심"
            />
            <NumberField
              label="가격 (원)"
              path={`signatureMenu.${index}.price`}
              placeholder="35000"
            />
            <button
              type="button"
              onClick={() => removeMenuItem(item.id)}
              className={classes.removeButton}
              disabled={menuItems.length <= 1}
            >
              삭제
            </button>
          </div>
        ))}

        <button type="button" onClick={addMenuItem} className={classes.addMenuButton}>
          + 메뉴 추가
        </button>
      </div>
    </div>
  )
}
