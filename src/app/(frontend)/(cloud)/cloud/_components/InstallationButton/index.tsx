import React, { useState } from 'react'

import { usePopupWindow } from '@root/utilities/use-popup-window.js'

import classes from './index.module.scss'

export const InstallationButton: React.FC<{
  onInstall?: (installationId: number) => void // eslint-disable-line no-unused-vars
  label?: string
  uuid: string
}> = ({ onInstall, label, uuid }) => {
  // this will be validated after the redirect back
  const [href] = useState(`https://github.com/apps/payload-cms/installations/new?state=${uuid}`)

  const { openPopupWindow } = usePopupWindow({
    href,
    eventType: 'github',
    onMessage: async (searchParams: { state: string; installation_id: string }) => {
      if (searchParams.state === uuid && typeof onInstall === 'function') {
        onInstall(parseInt(searchParams.installation_id, 10))
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
