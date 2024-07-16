/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback, useEffect, useState } from 'react'
import { ElementButton } from '@payloadcms/richtext-slate'
import { Modal, useModal } from '@faceless-ui/modal'
import { Button, MinimalTemplate, X } from 'payload/components'
import { ReactEditor, useSlate } from 'slate-react'
import { Transforms } from 'slate'
import { Form, Select, Submit } from 'payload/components/forms'
import './index.scss'

const baseClass = 'rich-text-spotlight-button'

const initialFormData = {
  element: 'h2',
}

const elements = [
  {
    label: 'H1',
    value: 'h1',
  },
  {
    label: 'H2',
    value: 'h2',
  },
  {
    label: 'H3',
    value: 'h3',
  },
  {
    label: 'Paragraph',
    value: 'p',
  },
]

const insertElement = (editor, { element }) => {
  const text = { text: ' ' }

  const spotlight = {
    type: 'spotlight',
    element,
    children: [text],
  }

  const nodes = [spotlight]

  if (editor.blurSelection) {
    Transforms.select(editor, editor.blurSelection)
  }

  Transforms.insertNodes(editor, nodes)
  ReactEditor.focus(editor)
}

const ToolbarButton: React.FC<{ path: string }> = ({ path }) => {
  const [renderModal, setRenderModal] = useState(false)
  const { openModal, toggleModal } = useModal()
  const modalSlug = `${path}-add-spotlight`
  const editor = useSlate()

  const handleAddSpotlight = useCallback(
    (_, { element }) => {
      insertElement(editor, { element })
      toggleModal(modalSlug)
      setRenderModal(false)
    },
    [editor, toggleModal, modalSlug],
  )

  useEffect(() => {
    if (renderModal) {
      openModal(modalSlug)
    }
  }, [renderModal, openModal, modalSlug])

  return (
    <>
      <ElementButton
        className={baseClass}
        format="spotlight"
        onClick={e => {
          e.preventDefault()
          setRenderModal(true)
        }}
      >
        Spotlight
      </ElementButton>
      {renderModal && (
        <Modal slug={modalSlug} className={`${baseClass}__modal`}>
          <MinimalTemplate className={`${baseClass}__template`}>
            <header className={`${baseClass}__header`}>
              <h3>Add spotlight</h3>
              <Button
                buttonStyle="none"
                onClick={() => {
                  toggleModal(modalSlug)
                  setRenderModal(false)
                }}
              >
                <X />
              </Button>
            </header>
            <Form onSubmit={handleAddSpotlight} initialData={initialFormData}>
              <Select required label="Element" options={elements} name="element" />
              <Submit>Add spotlight</Submit>
            </Form>
          </MinimalTemplate>
        </Modal>
      )}
    </>
  )
}

export default ToolbarButton
