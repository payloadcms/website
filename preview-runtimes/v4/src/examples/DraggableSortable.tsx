'use client'
import {
  Button,
  ChevronIcon,
  DraggableSortable,
  DraggableSortableItem,
  DragHandleIcon,
} from '@payloadcms/ui'
import { useState } from 'react'

import type { ComponentRenders } from './types'

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
      {items.map(({ id, label }, index) => (
        <DraggableSortableItem id={id} key={id}>
          {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
            <div
              className={classes.sortableItem}
              ref={setNodeRef}
              style={{ opacity: isDragging ? 0.6 : 1, transform, transition }}
            >
              <span>{label}</span>
              <div className={classes.sortableActions}>
                <Button
                  aria-label={`Move ${label} up`}
                  buttonStyle="ghost"
                  disabled={index === 0}
                  icon={<ChevronIcon direction="up" size={16} />}
                  margin={false}
                  onClick={() => setItems((current) => moveItem(current, index, index - 1))}
                />
                <Button
                  aria-label={`Move ${label} down`}
                  buttonStyle="ghost"
                  disabled={index === items.length - 1}
                  icon={<ChevronIcon direction="down" size={16} />}
                  margin={false}
                  onClick={() => setItems((current) => moveItem(current, index, index + 1))}
                />
                <Button
                  aria-label={`Drag to reorder ${label}`}
                  buttonStyle="ghost"
                  extraButtonProps={{ ...attributes, ...listeners }}
                  icon={<DragHandleIcon />}
                  margin={false}
                />
              </div>
            </div>
          )}
        </DraggableSortableItem>
      ))}
    </DraggableSortable>
  )
}
export const draggableSortableExamples: ComponentRenders = {
  basic: {
    render: () => <SortableExample />,
  },
}
