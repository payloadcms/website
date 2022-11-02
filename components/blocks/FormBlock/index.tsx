'use client'

import { RichText } from '@components/RichText'
import * as React from 'react'
import { Cell, Grid } from '@faceless-ui/css-grid'
import { useRouter } from 'next/router'
import Submit from '@components/forms/Submit'
import Form from '@components/forms/Form'
import { BlockSpacing } from '@components/BlockSpacing'
import { Data } from '@components/forms/types'
import { Gutter } from '@components/Gutter'
import { ThemeProvider, useTheme } from '@components/providers/Theme'
import { fields } from './fields'
import classes from './index.module.scss'
import { Page } from '../../../payload-types'
import { Width } from './Width'

export type FormBlockProps = Extract<Page['layout'][0], { blockType: 'form' }>

export const FormBlock: React.FC<FormBlockProps> = props => {
  const { formFields: { richText, form } = {} } = props

  if (!form || typeof form === 'string') return null

  const { id: formID, submitButtonLabel, confirmationType, redirect, confirmationMessage } = form
  const [isLoading, setIsLoading] = React.useState(false)

  const [hasSubmitted, setHasSubmitted] = React.useState<boolean>()

  const [error, setError] = React.useState<{ status?: string; message: string } | undefined>()

  const router = useRouter()

  const onSubmit = React.useCallback(
    (data: Data) => {
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
          const req = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/form-submissions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
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

          if (confirmationType === 'redirect' && redirect) {
            if (redirect.url) router.push(redirect.url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({
            message: 'Something went wrong.',
          })
        }
      }

      submitForm()
    },
    [router, formID, redirect, confirmationType],
  )

  const theme = useTheme()

  return (
    <BlockSpacing className={classes.formBlock}>
      <ThemeProvider theme={theme === 'dark' ? 'light' : 'dark'}>
        <div className={classes.bgWrapper}>
          <Gutter left="half" right="half" disableMobile className={classes.bgGutter}>
            <div className={classes.bg1} />
          </Gutter>
        </div>
        <div className={classes.bg2Wrapper}>
          <Gutter className={classes.bgGutter}>
            <Grid className={classes.bg2Grid}>
              <Cell start={7} cols={6} startM={2} colsM={7} className={classes.bg2Cell}>
                <div className={classes.bg2} />
              </Cell>
            </Grid>
          </Gutter>
        </div>
        <Gutter className={classes.gutter}>
          <Grid>
            <Cell cols={5} startL={2} colsM={8} startM={1} className={classes.richTextCell}>
              {richText && <RichText content={richText} />}
            </Cell>
            <Cell cols={6} start={8} colsL={4} colsM={8} startM={1} className={classes.formCell}>
              <div className={classes.formCellContent}>
                {!isLoading && hasSubmitted && confirmationType === 'message' && (
                  <RichText content={confirmationMessage} />
                )}
                {isLoading && !hasSubmitted && <p>Loading, please wait...</p>}
                {error && <div>{`${error.status || '500'}: ${error.message || ''}`}</div>}
                {!hasSubmitted && (
                  <Form onSubmit={onSubmit}>
                    <div className={classes.fieldWrap}>
                      {form &&
                        form.fields.map((field, index) => {
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
                    </div>
                    <Submit processing={isLoading} label={submitButtonLabel} />
                  </Form>
                )}
              </div>
            </Cell>
          </Grid>
        </Gutter>
      </ThemeProvider>
    </BlockSpacing>
  )
}
