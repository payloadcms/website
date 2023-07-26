'use client'

import * as React from 'react'
import { Checkbox } from '@forms/fields/Checkbox'
import FormComponent from '@forms/Form'
import Label from '@forms/Label'
import Submit from '@forms/Submit'
import { usePathname, useRouter } from 'next/navigation'

import { RichText } from '@components/RichText'
import { Form } from '@root/payload-types'
import { getCookie } from '@root/utilities/get-cookie'
import { fields } from './fields'
import { Width } from './Width'

import classes from './index.module.scss'

const RenderForm = ({ form }: { form: Form }) => {
  const {
    id: formID,
    submitButtonLabel,
    confirmationType,
    redirect: formRedirect,
    confirmationMessage,
    leader,
    enableGDPR,
  } = form

  const [isLoading, setIsLoading] = React.useState(false)

  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>()

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  const router = useRouter()

  const pathname = usePathname()

  // const [isProductUpdatesChecked, setProductUpdatesChecked] = React.useState(false)

  const onSubmit = React.useCallback(
    ({ data }) => {
      let loadingTimerID: NodeJS.Timer

      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        // const dataToSend = [
        //   ...Object.entries(data).map(([name, value]) => ({
        //     field: name,
        //     value,
        //   })),
        //   {
        //     field: 'productUpdates',
        //     value: isProductUpdatesChecked,
        //   },
        // ]

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
          {leader && <RichText className={classes.leader} content={leader} />}
          <FormComponent onSubmit={onSubmit}>
            <div className={classes.fieldWrap}>
              {form.fields?.map((field, index) => {
                const Field: React.FC<any> = fields?.[field.blockType]
                if (Field) {
                  return (
                    <Width key={index} width={'width' in field ? field.width : 100}>
                      <Field
                        path={'name' in field ? field.name : undefined}
                        form={form}
                        {...field}
                      />
                    </Width>
                  )
                }
                return null
              })}
              {enableGDPR && (
                <Width width={100}>
                  <div className={classes.checkboxWrapper}>
                    <Checkbox
                      path="productUpdates"
                      // onChange={isChecked => setProductUpdatesChecked(isChecked)}
                    />
                    <Label
                      className={classes.label}
                      label="Stay in the loop with periodic product updates from Payload. (You can unsubscribe at any time)"
                    />
                  </div>
                </Width>
              )}
            </div>
            <Submit processing={isLoading} label={submitButtonLabel} />
          </FormComponent>
        </React.Fragment>
      )}
    </div>
  )
}

export const CMSForm: React.FC<{
  form?: string | Form
}> = props => {
  const { form } = props

  if (!form || typeof form === 'string') return null

  return <RenderForm form={form} />
}
