import { Popup } from '@payloadcms/ui/elements/Popup'
import * as PopupList from '@payloadcms/ui/elements/Popup/PopupButtonList'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'

export const popupExamples: ComponentRenders = {
  menu: {
    render: ({ theme }) => (
      <div className={classes.popupDemo}>
        <Popup
          button="Actions"
          portalClassName={[
            classes.popupPortal,
            theme === 'dark' ? classes.popupPortalDark : classes.popupPortalLight,
          ].join(' ')}
          size="small"
        >
          <PopupList.ButtonGroup>
            <PopupList.Button onClick={() => undefined}>Edit</PopupList.Button>
            <PopupList.Button onClick={() => undefined}>Duplicate</PopupList.Button>
            <PopupList.Divider />
            <PopupList.Button onClick={() => undefined}>Delete</PopupList.Button>
          </PopupList.ButtonGroup>
        </Popup>
      </div>
    ),
  },
}
