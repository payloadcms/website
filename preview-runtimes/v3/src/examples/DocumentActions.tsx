import { Button } from '@payloadcms/ui/elements/Button'

import type { ComponentDesign, ComponentExamples } from './types'

import classes from '../examples.module.scss'

const editActionsDesign: ComponentDesign = {
  code: `#action-save-draft.btn--style-secondary {
  --color: #6d5dfc;
  --btn-border: 1px solid #6d5dfc;
  --hover-color: #5947e5;
  --hover-btn-border: 1px solid #5947e5;
}

#action-publish.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}`,
  description:
    'Use the stable action IDs together with Button style classes when Save and Publish controls need treatment distinct from other Admin buttons.',
  variables: [
    { name: '--bg-color', description: 'Primary action background.' },
    { name: '--color', description: 'Action label color.' },
    { name: '--hover-bg', description: 'Primary action background on interaction.' },
    { name: '--btn-border', description: 'Secondary action border.' },
    { name: '--hover-btn-border', description: 'Secondary action border on interaction.' },
  ],
}

const saveActionDesign: ComponentDesign = {
  code: `#action-save.btn--style-primary {
  --bg-color: #6d5dfc;
  --color: #ffffff;
  --hover-bg: #5947e5;
  --hover-color: #ffffff;
}`,
  description:
    'Use the Save action ID together with its Button style class when the document Save control needs treatment distinct from other primary Admin buttons.',
  variables: [
    { name: '--bg-color', description: 'Save action background.' },
    { name: '--color', description: 'Save action label color.' },
    { name: '--hover-bg', description: 'Save action background on interaction.' },
    { name: '--hover-color', description: 'Save action label color on interaction.' },
  ],
}

export const documentActionsExamples: ComponentExamples = {
  bulk: {
    code: `<EditMany collection={collection} />
<PublishMany collection={collection} />
<UnpublishMany collection={collection} />
<DeleteMany collection={collection} />`,
    design: {
      code: `.list-selection__button {
  color: #6d5dfc;
  font-weight: 600;
}

.list-selection__button:hover,
.list-selection__button:focus-visible {
  color: #5947e5;
  text-decoration: underline;
}`,
      description:
        'Bulk actions share the ListSelection button treatment. Override that class to customize selection actions without changing standard Buttons.',
      variables: [
        { name: 'color', description: 'Bulk action label color.' },
        { name: 'font-weight', description: 'Bulk action label emphasis.' },
        { name: 'text-decoration', description: 'Interaction feedback for bulk actions.' },
      ],
    },
    render: () => (
      <div className={classes.bulkActionsDemo}>
        <span>3 selected</span>
        <span aria-hidden="true">—</span>
        <div className={classes.bulkActionsList}>
          <Button buttonStyle="none" className="list-selection__button" margin={false}>
            Edit
          </Button>
          <Button buttonStyle="none" className="list-selection__button" margin={false}>
            Publish
          </Button>
          <Button buttonStyle="none" className="list-selection__button" margin={false}>
            Delete
          </Button>
        </div>
      </div>
    ),
  },
  editView: {
    code: `<SaveDraftButton />
<PublishButton />`,
    design: editActionsDesign,
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
    code: `<SaveButton />`,
    design: saveActionDesign,
    render: () => (
      <Button id="action-save" margin={false}>
        Save
      </Button>
    ),
  },
}
