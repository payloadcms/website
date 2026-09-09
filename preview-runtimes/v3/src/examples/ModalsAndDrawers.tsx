'use client'

import { ModalContext, ModalProvider } from '@faceless-ui/modal'
import { Button } from '@payloadcms/ui/elements/Button'
import { ConfirmationModal } from '@payloadcms/ui/elements/ConfirmationModal'
import { useModal } from '@payloadcms/ui/elements/Modal'
import { XIcon } from '@payloadcms/ui/icons/X'
import { useCallback, useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const confirmationSlug = 'component-preview-confirmation'

const portalClasses = (theme: 'dark' | 'light') =>
  [
    classes.overlayPortal,
    theme === 'dark' ? classes.overlayPortalDark : classes.overlayPortalLight,
  ].join(' ')

const OverlayPortal = ({ theme }: { theme: 'dark' | 'light' }) => {
  const { setContainerRef } = useModal()
  const setPortalRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) {
        setContainerRef(node)
      }
    },
    [setContainerRef],
  )

  return (
    <div
      className={[
        'component-preview-modal__modal-container',
        classes.overlayExampleContainer,
        classes.confirmationOverlayExampleContainer,
        portalClasses(theme),
      ].join(' ')}
      ref={setPortalRef}
    />
  )
}

const EmbeddedModalScope = ({ children }: { children: React.ReactNode }) => {
  const modal = useModal()
  const setBodyScrollLock = useCallback(() => undefined, [])

  return <ModalContext value={{ ...modal, setBodyScrollLock }}>{children}</ModalContext>
}

const OverlayExampleFrame = ({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: 'dark' | 'light'
}) => (
  <ModalProvider classPrefix="component-preview-modal" transTime={200} zIndex={1}>
    <EmbeddedModalScope>
      <div className={classes.overlayExampleFrame}>
        {children}
        <OverlayPortal theme={theme} />
      </div>
    </EmbeddedModalScope>
  </ModalProvider>
)

const ConfirmationDemo = () => {
  const { openModal } = useModal()

  return (
    <>
      <Button margin={false} onClick={() => openModal(confirmationSlug)}>
        Open confirmation modal
      </Button>
      <ConfirmationModal
        body="Confirm before continuing with this action."
        cancelLabel="Cancel"
        confirmLabel="Confirm"
        heading="Confirm action"
        modalSlug={confirmationSlug}
        onConfirm={() => undefined}
      />
    </>
  )
}

type DrawerPreviewState = 'closed' | 'closing' | 'open'

const DrawerDemo = () => {
  const [state, setState] = useState<DrawerPreviewState>('closed')

  const closeDrawer = () => setState('closing')

  return (
    <>
      <Button margin={false} onClick={() => setState('open')}>
        Open drawer
      </Button>
      <div
        aria-hidden={state === 'closed'}
        aria-label="Drawer example"
        className={classes.drawerPreviewSurface}
        data-state={state}
        onTransitionEnd={(event) => {
          if (
            event.currentTarget === event.target &&
            event.propertyName === 'transform' &&
            state === 'closing'
          ) {
            setState('closed')
          }
        }}
        role="dialog"
      >
        <button
          aria-label="Close drawer"
          className={classes.drawerPreviewDismiss}
          onClick={closeDrawer}
          type="button"
        />
        <div className={classes.drawerPreviewContent}>
          <div className={classes.drawerPreviewHeader}>
            <h2>Drawer example</h2>
            <button
              aria-label="Close drawer"
              className={classes.drawerPreviewClose}
              onClick={closeDrawer}
              type="button"
            >
              <XIcon />
            </button>
          </div>
          <p>Place supporting information or controls related to the current view here.</p>
        </div>
      </div>
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
  cancelLabel="Cancel"
  confirmLabel="Confirm"
  heading="Confirm action"
  modalSlug={modalSlug}
  onConfirm={() => performAction()}
/>`,
    render: ({ theme }) => (
      <OverlayExampleFrame theme={theme}>
        <ConfirmationDemo />
      </OverlayExampleFrame>
    ),
  },
  drawer: {
    code: `const drawerSlug = 'example-drawer'
const { closeModal, openModal } = useModal()

<Button onClick={() => openModal(drawerSlug)}>Open drawer</Button>
<Drawer slug={drawerSlug} title="Drawer example">
  <DrawerContentContainer>
    <p>Place supporting information or controls related to the current view here.</p>
    <Button
      buttonStyle="secondary"
      onClick={() => closeModal(drawerSlug)}
    >
      Close drawer
    </Button>
  </DrawerContentContainer>
</Drawer>`,
    render: ({ theme }) => (
      <div
        className={[
          classes.overlayExampleFrame,
          classes.drawerOverlayExampleFrame,
          portalClasses(theme),
        ].join(' ')}
      >
        <DrawerDemo />
      </div>
    ),
  },
}
