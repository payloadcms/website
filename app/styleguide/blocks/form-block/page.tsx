import { FormBlock, FormBlockProps } from '@components/blocks/FormBlock'
import React from 'react'
import { StyleguidePageContent } from '../../PageContent'

const data: FormBlockProps = {
  blockType: 'form',
  formFields: {
    richText: [
      { children: [{ text: 'Interested in learning more?' }], type: 'h2' },
      {
        children: [
          {
            text: 'Enterprises throughout the Fortune 500 leverage Payload for critical content infrastructure.',
          },
        ],
      },
      {
        children: [
          { text: 'Let us design a plan and budget deliberately meant to solve your needs.' },
        ],
      },
    ],
    form: {
      id: '636270638500b86c17b16b40',
      title: 'Contact',
      leader: [
        {
          text: 'For Enterprise',
        },
      ],
      fields: [
        {
          name: 'name',
          label: 'Name',
          defaultValue: '0',
          required: true,
          id: '6362704a4cc94f87f3b7ad3b',
          blockType: 'text',
        },
        {
          name: 'email',
          label: 'Email',
          required: true,
          id: '63627d022b0cb12d51e4942a',
          blockType: 'email',
        },
        {
          name: 'company',
          label: 'Company',
          required: true,
          id: '63627d0b2b0cb12d51e4942b',
          blockType: 'text',
        },
      ],
      confirmationType: 'message',
      confirmationMessage: [{ children: [{ text: 'Confirmed.' }] }],
      emails: [],
      createdAt: '2022-11-02T13:28:03.513Z',
      updatedAt: '2022-11-02T14:22:25.221Z',
      redirect: { url: '' },
    },
  },
}
const dataWithContainer: FormBlockProps = {
  ...data,
  formFields: {
    ...data.formFields,
    container: true,
  },
}

const FormBlockPage: React.FC = () => {
  return (
    <StyleguidePageContent title="Form Block">
      <FormBlock {...data} />
      <FormBlock {...dataWithContainer} />
    </StyleguidePageContent>
  )
}

export default FormBlockPage
