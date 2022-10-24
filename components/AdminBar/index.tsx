import React, { useState } from 'react'
import { PayloadMeUser, PayloadAdminBarProps, PayloadAdminBar } from 'payload-admin-bar'
import classes from './index.module.scss'

export const AdminBar: React.FC<
  PayloadAdminBarProps & {
    className?: string
  }
> = props => {
  const { className, collection, id, preview, onPreviewExit } = props

  const [user, setUser] = useState<PayloadMeUser>()

  return (
    <div className={[classes.adminBar, user && classes.show, className].filter(Boolean).join(' ')}>
      <div className={classes.blockContainer}>
        <PayloadAdminBar
          collection={collection}
          id={id}
          preview={preview}
          onPreviewExit={onPreviewExit}
          cmsURL={process.env.NEXT_PUBLIC_CMS_URL}
          onAuthChange={setUser}
          className={classes.payloadAdminBar}
          classNames={{
            user: classes.user,
            logo: classes.logo,
            controls: classes.controls,
          }}
          logo={<div>Payload CMS</div>}
          style={{
            position: 'relative',
            zIndex: 'unset',
            padding: 0,
            backgroundColor: 'transparent',
          }}
        />
      </div>
    </div>
  )
}
