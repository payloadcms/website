'use client'

import * as React from 'react'
import Form from '@forms/Form'
import { usePathname, useRouter } from 'next/navigation'

import { RichText } from '@components/RichText'
import { CrosshairIcon } from '@root/icons/CrosshairIcon'
import { Form as FormType } from '@root/payload-types'
import { getCookie } from '@root/utilities/get-cookie'
import { fields } from './fields'
import Submit from './Submit'

import classes from './index.module.scss'

const buildInitialState = fields => {
  const state = {}

  fields.forEach(field => {
    state[field.name] = {
      value: '',
      valid: !field.required,
      initialValue: undefined,
      errorMessage: 'This field is required.',
    }
  })

  return state
}

const RenderForm = ({ form }: { form: FormType }) => {
  const {
    id: formID,
    submitButtonLabel,
    confirmationType,
    redirect: formRedirect,
    confirmationMessage,
  } = form

  const [isLoading, setIsLoading] = React.useState(false)

  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>()

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  const initialState = buildInitialState(form.fields)

  const router = useRouter()

  const pathname = usePathname()

  const onSubmit = React.useCallback(
    ({ data }) => {
      let loadingTimerID: NodeJS.Timer

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // delay loading indicator by 1s
        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const hubspotCookie = getCookie('hubspotutk')
          const pageUri = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`
          const slugParts = pathname?.split('/')
          const pageName = slugParts?.at(-1) === '' ? 'Home' : slugParts?.at(-1)
          const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/form-submissions`, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
              hubspotCookie,
              pageUri,
              pageName,
            }),
          })

          const res = await req.json()

          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              status: res.status,
              message: res.errors?.[0]?.message || 'Internal Server Error',
            })

            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && formRedirect) {
            const { url } = formRedirect

            if (!url) return

            const redirectUrl = new URL(url, process.env.NEXT_PUBLIC_SITE_URL)

            try {
              if (url.startsWith('/') || redirectUrl.origin === process.env.NEXT_PUBLIC_SITE_URL) {
                router.push(redirectUrl.href)
              } else {
                window.location.assign(url)
              }
            } catch (err) {
              console.warn(err) // eslint-disable-line no-console
              setError({
                message: 'Something went wrong. Did not redirect.',
              })
            }
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      submitForm()
    },
    [router, formID, formRedirect, confirmationType, pathname],
  )

  if (!form?.id) return null

  return (
    <div className={classes.cmsForm}>
      {!isLoading && hasSubmitted && confirmationType === 'message' && (
        <RichText content={confirmationMessage} />
      )}
      {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
      {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
      {!hasSubmitted && (
        <React.Fragment>
          <Form onSubmit={onSubmit} initialState={initialState}>
            <div className={classes.formFieldsWrap}>
              {form.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                const isLastField = index === (form.fields?.length ?? 0) - 1
                if (Field) {
                  return (
                    <div
                      key={index}
                      className={[classes.fieldWrap, !isLastField ? classes.hideBottomBorder : '']
                        .filter(Boolean)
                        .join(' ')}
                    >
                      <Field
                        path={'name' in field ? field.name : undefined}
                        form={form}
                        {...field}
                      />
                    </div>
                  )
                }
                return null
              })}
              <CrosshairIcon className={[classes.crosshair, classes.crosshairLeft].join(' ')} />
            </div>
            <Submit
              className={[classes.submitButton, classes.hideTopBorder].filter(Boolean).join(' ')}
              processing={isLoading}
              label={submitButtonLabel}
              iconRotation={45}
            />
          </Form>
        </React.Fragment>
      )}
    </div>
  )
}

export const CMSForm: React.FC<{
  form?: string | FormType | null
}> = props => {
  const { form } = props

  if (!form || typeof form === 'string') return null

  return <RenderForm form={form} />
}
