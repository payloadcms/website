import { usePopupWindow } from '@root/utilities/use-popup-window'
import React, { useState } from 'react'

import classes from './index.module.scss'

export const InstallationButton: React.FC<{
  label?: string
  onInstall?: (installationId: number) => void
  uuid: string
}> = ({ label, onInstall, uuid }) => {
  // this will be validated after the redirect back
  const [href] = useState(`https://github.com/apps/payload-cms/installations/new?state=${uuid}`)

  const { openPopupWindow } = usePopupWindow({
    eventType: 'github',
    href,
    onMessage: async (searchParams: { installation_id: string; state: string }) => {
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
