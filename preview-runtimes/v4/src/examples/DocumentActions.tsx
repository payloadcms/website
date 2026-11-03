import { Button } from '@payloadcms/ui/elements/Button'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
export const documentActionsExamples: ComponentRenders = {
  bulk: {
    render: () => (
      <div className={classes.bulkActionsDemo}>
        <span>3 selected</span>
        <span aria-hidden="true">—</span>
        <div className={classes.bulkActionsList}>
          <Button buttonStyle="ghost" className="list-selection__button" margin={false}>
            Edit
          </Button>
          <Button buttonStyle="ghost" className="list-selection__button" margin={false}>
            Publish
          </Button>
          <Button buttonStyle="ghost" className="list-selection__button" margin={false}>
            Delete
          </Button>
        </div>
      </div>
    ),
  },
  editView: {
    render: () => (
      <div className={classes.row}>
        <Button
          buttonStyle="secondary"
          className="save-draft"
          id="action-save-draft"
          margin={false}
        >
          Save Draft
        </Button>
        <Button id="action-publish" margin={false}>
          Publish
        </Button>
      </div>
    ),
  },
  save: {
    render: () => (
      <Button id="action-save" margin={false}>
        Save
      </Button>
    ),
  },
}
