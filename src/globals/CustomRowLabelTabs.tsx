'use client'
import React from 'react'
import { useRowLabel } from '@payloadcms/ui'
import { PayloadClientReactComponent, RowLabelComponent } from 'payload'

const CustomRowLabelTabs: PayloadClientReactComponent<RowLabelComponent> = () => {
  const { data } = useRowLabel<any>()

  return data.label || '...'
}

export default CustomRowLabelTabs
