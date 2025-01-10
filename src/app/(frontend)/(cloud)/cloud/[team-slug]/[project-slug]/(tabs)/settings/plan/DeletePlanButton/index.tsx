'use client'

import { Button } from '@components/Button/index.js'
import { useModal } from '@faceless-ui/modal'
import React from 'react'

import { deletePlanModalSlug } from '../DeletePlanModal/index.js'

export const DeletePlanButton: React.FC = () => {
  const { openModal } = useModal()

  return (
    <Button appearance="danger" label="Delete" onClick={() => openModal(deletePlanModalSlug)} />
  )
}
