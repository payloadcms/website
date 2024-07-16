/* eslint-disable import/no-extraneous-dependencies */
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { Modal, useModal } from '@faceless-ui/modal'
import { ElementButton } from '@payloadcms/richtext-slate'
import { Button, MinimalTemplate, X } from 'payload/components'
import { Form, Select, Submit, Text } from 'payload/components/forms'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'

import VideoIcon from '../Icon'

import './index.scss'

const initialFormData = {
  source: 'youtube',
}

const sources = [
  {
    label: 'YouTube',
    value: 'youtube',
  },
  {
    label: 'Vimeo',
    value: 'vimeo',
  },
]

const baseClass = 'video-rich-text-button'

const insertVideo = (editor, { id, source }) => {
  const text = { text: ' ' }

  const video = {
    type: 'video',
    id,
    source,
    children: [text],
  }

  const nodes = [video, { type: 'p', children: [{ text: '' }] }]

  if (editor.blurSelection) {
    Transforms.select(editor, editor.blurSelection)
  }

  Transforms.insertNodes(editor, nodes)
  ReactEditor.focus(editor)
}

const VideoButton: React.FC<{ path: string }> = ({ path }) => {
  const { openModal, toggleModal } = useModal()
  const editor = useSlate()
  const [renderModal, setRenderModal] = useState(false)
  const modalSlug = `${path}-add-video`

  const handleAddVideo = useCallback(
    (_, { id, source }) => {
      insertVideo(editor, { id, source })
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
    <Fragment>
      <ElementButton
        className={baseClass}
        format="video"
        onClick={e => {
          e.preventDefault()
          setRenderModal(true)
        }}
      >
        <VideoIcon />
      </ElementButton>
      {renderModal && (
        <Modal slug={modalSlug} className={`${baseClass}__modal`}>
          <MinimalTemplate className={`${baseClass}__template`}>
            <header className={`${baseClass}__header`}>
              <h3>Add Video</h3>
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
            <Form onSubmit={handleAddVideo} initialData={initialFormData}>
              <Select required label="Video Source" options={sources} name="source" />
              <Text label="ID" required name="id" />
              <Submit>Add video</Submit>
            </Form>
          </MinimalTemplate>
        </Modal>
      )}
    </Fragment>
  )
}

export default VideoButton
