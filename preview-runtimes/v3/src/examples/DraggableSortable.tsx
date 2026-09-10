'use client'

import { Button, DraggableSortable, DraggableSortableItem, DragHandleIcon } from '@payloadcms/ui'
import { useState } from 'react'

import type { ComponentExamples } from './types'

import classes from '../examples.module.scss'

const initialItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'settings', label: 'Settings' },
]

const moveItem = <Item,>(items: Item[], moveFromIndex: number, moveToIndex: number) => {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(moveFromIndex, 1)

  nextItems.splice(moveToIndex, 0, movedItem)
  return nextItems
}

const SortableExample = () => {
  const [items, setItems] = useState(initialItems)

  return (
    <DraggableSortable
      className={classes.sortableList}
      ids={items.map(({ id }) => id)}
      onDragEnd={({ moveFromIndex, moveToIndex }) => {
        setItems((currentItems) => moveItem(currentItems, moveFromIndex, moveToIndex))
      }}
    >
      {items.map(({ id, label }) => (
        <DraggableSortableItem id={id} key={id}>
          {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
            <div
              className={classes.sortableItem}
              ref={setNodeRef}
              style={{ opacity: isDragging ? 0.6 : 1, transform, transition }}
            >
              <span>{label}</span>
              <Button
                aria-label={`Reorder ${label}`}
                buttonStyle="icon-label"
                extraButtonProps={{ ...attributes, ...listeners }}
                icon={<DragHandleIcon />}
                margin={false}
                size="small"
              />
            </div>
          )}
        </DraggableSortableItem>
      ))}
    </DraggableSortable>
  )
}

export const draggableSortableExamples: ComponentExamples = {
  basic: {
    code: `'use client'

import {
  Button,
  DraggableSortable,
  DraggableSortableItem,
  DragHandleIcon,
} from '@payloadcms/ui'
import { useState } from 'react'

const initialItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'settings', label: 'Settings' },
]

const moveItem = (items, moveFromIndex, moveToIndex) => {
  const nextItems = [...items]
  const [movedItem] = nextItems.splice(moveFromIndex, 1)
  nextItems.splice(moveToIndex, 0, movedItem)
  return nextItems
}

export function SortableList() {
  const [items, setItems] = useState(initialItems)

  return (
    <DraggableSortable
      ids={items.map(({ id }) => id)}
      onDragEnd={({ moveFromIndex, moveToIndex }) => {
        setItems((current) => moveItem(current, moveFromIndex, moveToIndex))
      }}
    >
      {items.map(({ id, label }) => (
        <DraggableSortableItem id={id} key={id}>
          {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
            <div
              ref={setNodeRef}
              style={{ opacity: isDragging ? 0.6 : 1, transform, transition }}
            >
              <span>{label}</span>
              <Button
                aria-label={\`Reorder \${label}\`}
                buttonStyle="icon-label"
                extraButtonProps={{ ...attributes, ...listeners }}
                icon={<DragHandleIcon />}
                margin={false}
              />
            </div>
          )}
        </DraggableSortableItem>
      ))}
    </DraggableSortable>
  )
}`,
    design: {
      code: `.sortable-list {
  display: grid;
  gap: calc(var(--base) / 2);
}

.sortable-item {
  align-items: center;
  background: var(--theme-elevation-50);
  border: 1px solid var(--theme-elevation-200);
  display: flex;
  justify-content: space-between;
  padding: calc(var(--base) / 2) var(--base);
}`,
      description:
        'Style the list and row wrappers while leaving the drag transform and transition inline on each item. Payload theme variables keep the surface consistent across light and dark modes.',
      variables: [
        { name: '--theme-elevation-50', description: 'Sortable item background.' },
        { name: '--theme-elevation-200', description: 'Sortable item border.' },
        { name: '--base', description: 'Spacing within and between items.' },
      ],
    },
    render: () => <SortableExample />,
  },
}
