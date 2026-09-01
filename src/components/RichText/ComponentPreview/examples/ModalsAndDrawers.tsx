'use client'

import { Button } from '@payloadcms/ui/elements/Button'
import { ConfirmationModal } from '@payloadcms/ui/elements/ConfirmationModal'
import { Drawer } from '@payloadcms/ui/elements/Drawer'
import { DrawerContentContainer } from '@payloadcms/ui/elements/DrawerContentContainer'
import { useModal } from '@payloadcms/ui/elements/Modal'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const confirmationSlug = 'component-preview-confirmation'
const drawerSlug = 'component-preview-drawer'

const portalClasses = (theme: 'dark' | 'light') =>
  [
    classes.overlayPortal,
    theme === 'dark' ? classes.overlayPortalDark : classes.overlayPortalLight,
  ].join(' ')

const ConfirmationDemo = ({ theme }: { theme: 'dark' | 'light' }) => {
  const { openModal } = useModal()

  return (
    <>
      <Button margin={false} onClick={() => openModal(confirmationSlug)} size="small">
        Open confirmation modal
      </Button>
      <ConfirmationModal
        body="Confirm before continuing with this action."
        className={portalClasses(theme)}
        confirmLabel="Confirm"
        heading="Confirm action"
        modalSlug={confirmationSlug}
        onConfirm={() => undefined}
      />
    </>
  )
}

const DrawerDemo = ({ theme }: { theme: 'dark' | 'light' }) => {
  const { openModal } = useModal()

  return (
    <>
      <Button margin={false} onClick={() => openModal(drawerSlug)} size="small">
        Open drawer
      </Button>
      <Drawer className={portalClasses(theme)} slug={drawerSlug} title="Drawer title">
        <DrawerContentContainer>
          <p>Drawer content</p>
        </DrawerContentContainer>
      </Drawer>
    </>
  )
}

export const modalsAndDrawersExamples: ComponentExamples = {
  confirmation: {
    code: `const modalSlug = 'confirm-action'
const { openModal } = useModal()

<Button onClick={() => openModal(modalSlug)}>Open confirmation modal</Button>
<ConfirmationModal
  body="Confirm before continuing with this action."
  confirmLabel="Confirm"
  heading="Confirm action"
  modalSlug={modalSlug}
  onConfirm={() => performAction()}
/>`,
    render: ({ theme }) => <ConfirmationDemo theme={theme} />,
  },
  drawer: {
    code: `const drawerSlug = 'example-drawer'
const { openModal } = useModal()

<Button onClick={() => openModal(drawerSlug)}>Open drawer</Button>
<Drawer slug={drawerSlug} title="Drawer title">
  <DrawerContentContainer>
    <p>Drawer content</p>
  </DrawerContentContainer>
</Drawer>`,
    render: ({ theme }) => <DrawerDemo theme={theme} />,
  },
}
