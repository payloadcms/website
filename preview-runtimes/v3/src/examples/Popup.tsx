import { Popup } from '@payloadcms/ui/elements/Popup'
import * as PopupList from '@payloadcms/ui/elements/Popup/PopupButtonList'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

export const popupExamples: ComponentExamples = {
  menu: {
    code: `<Popup button="Actions" size="small">
  <PopupList.ButtonGroup>
    <PopupList.Button onClick={() => editDocument()}>Edit</PopupList.Button>
    <PopupList.Button onClick={() => duplicateDocument()}>Duplicate</PopupList.Button>
    <PopupList.Divider />
    <PopupList.Button onClick={() => deleteDocument()}>Delete</PopupList.Button>
  </PopupList.ButtonGroup>
</Popup>`,
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
