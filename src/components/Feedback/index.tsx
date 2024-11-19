import { CMSForm } from '@components/CMSForm'
import { Drawer, DrawerToggler } from '@components/Drawer'
import { fetchForm } from '@data'
import { ArrowIcon } from '@icons/ArrowIcon'
import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import React from 'react'

import classes from './index.module.scss'
export const Feedback: React.FC<{ path: string; ref?: string }> = async ({
  path,
  ref = 'main',
}) => {
  const drawerSlug = 'feedbackDrawer'
  const formName = 'Feedback'
  const { isEnabled: draft } = await draftMode()

  const getFeedbackForm = draft
    ? fetchForm(formName)
    : unstable_cache(fetchForm, [`form-${formName}`], {
        tags: [`form-${formName}`],
      })(formName)

  const form = await getFeedbackForm

  return (
    <div className={classes.feedbackWrapper}>
      <Link
        className={classes.gitHubLink}
        href={`https://github.com/payloadcms/payload/blob/${ref}/docs/${path}.mdx`}
        target="_blank"
      >
        Edit this page on GitHub <ArrowIcon className={classes.arrow} />
      </Link>
      {form && typeof form !== 'string' && (
        <React.Fragment>
          <DrawerToggler className={classes.drawerButton} slug={drawerSlug}>
            Leave feedback <ArrowIcon className={classes.arrow} />
          </DrawerToggler>
          <Drawer size="s" slug={drawerSlug} title="Documentation Feedback">
            <CMSForm form={form} />
          </Drawer>
        </React.Fragment>
      )}
    </div>
  )
}
