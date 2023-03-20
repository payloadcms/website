import React, { useMemo } from 'react'
import { v4 as uuid } from 'uuid'

import { usePopupWindow } from '@root/utilities/use-popup-window'

import classes from './index.module.scss'

// generate an id to use for the state
// this will be validated after the the redirect back
const id = uuid()
const href = `https://github.com/apps/payload-cms/installations/new?state=${id}`

export const InstallationButton: React.FC<{
  onInstallation?: (installationId: number) => void // eslint-disable-line no-unused-vars
  label?: string
}> = ({ onInstallation, label }) => {
  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github',
    onMessage: async (searchParams: { state: string; installation_id: string }) => {
      if (searchParams.state === id && typeof onInstallation === 'function') {
        onInstallation(parseInt(searchParams.installation_id, 10))
      }
    },
  })

  // use an anchor tag with an href despite the onClick for better UX
  return (
    <a className={classes.addAccountButton} href={href} onClick={openPopupWindow}>
      {label || 'Install the Payload App'}
    </a>
  )
}

export const useInstallationButton = (args?: {
  onInstallation: (installationId: number) => void // eslint-disable-line no-unused-vars
  label?: string
}): [React.FC] => {
  const { onInstallation, label } = args || {}

  const MemoizedInstallationButton = useMemo(
    () => () => {
      return <InstallationButton onInstallation={onInstallation} label={label} />
    },
    [onInstallation, label],
  )

  return [MemoizedInstallationButton]
}
