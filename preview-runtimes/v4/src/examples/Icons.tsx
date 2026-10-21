import {
  CalendarIcon,
  CheckIcon,
  ChevronIcon,
  CloseMenuIcon,
  CodeBlockIcon,
  CopyIcon,
  DocumentIcon,
  Dots,
  DragHandleIcon,
  EditIcon,
  FolderIcon,
  GearIcon,
  GridViewIcon,
  LineIcon,
  LinkIcon,
  ListViewIcon,
  LogOutIcon,
  MinimizeMaximizeIcon,
  MoreIcon,
  MoveFolderIcon,
  NewTabIcon,
  PlusIcon,
  SearchIcon,
  SwapIcon,
  XIcon,
} from '@payloadcms/ui'
import { Tooltip } from '@payloadcms/ui/elements/Tooltip'
import { useState } from 'react'

import type { ComponentRenders } from './types'

import classes from '../examples.module.scss'
const icons = [
  { Icon: CalendarIcon, label: 'CalendarIcon' },
  { Icon: CheckIcon, label: 'CheckIcon' },
  { Icon: ChevronIcon, label: 'ChevronIcon' },
  { Icon: CloseMenuIcon, label: 'CloseMenuIcon' },
  { Icon: CodeBlockIcon, label: 'CodeBlockIcon' },
  { Icon: CopyIcon, label: 'CopyIcon' },
  { Icon: DocumentIcon, label: 'DocumentIcon' },
  { Icon: DragHandleIcon, label: 'DragHandleIcon' },
  { Icon: EditIcon, label: 'EditIcon' },
  { Icon: NewTabIcon, label: 'NewTabIcon' },
  { Icon: FolderIcon, label: 'FolderIcon' },
  { Icon: GearIcon, label: 'GearIcon' },
  { Icon: GridViewIcon, label: 'GridViewIcon' },
  { Icon: LineIcon, label: 'LineIcon' },
  { Icon: LinkIcon, label: 'LinkIcon' },
  { Icon: ListViewIcon, label: 'ListViewIcon' },
  { Icon: LogOutIcon, label: 'LogOutIcon' },
  { Icon: Dots, label: 'Dots' },
  { Icon: MinimizeMaximizeIcon, label: 'MinimizeMaximizeIcon' },
  { Icon: MoreIcon, label: 'MoreIcon' },
  { Icon: MoveFolderIcon, label: 'MoveFolderIcon' },
  { Icon: PlusIcon, label: 'PlusIcon' },
  { Icon: SearchIcon, label: 'SearchIcon' },
  { Icon: SwapIcon, label: 'SwapIcon' },
  { Icon: XIcon, label: 'XIcon' },
]
const IconGallery = () => {
  const [activeIcon, setActiveIcon] = useState<null | string>(null)
  return (
    <div className={classes.iconGrid}>
      {icons.map(({ Icon, label }) => (
        <span
          aria-label={label}
          className={classes.iconSample}
          key={label}
          onMouseEnter={() => setActiveIcon(label)}
          onMouseLeave={() => setActiveIcon(null)}
          role="img"
        >
          <span aria-hidden="true" className={classes.iconGraphic}>
            <Icon />
          </span>
          <Tooltip delay={0} position="top" show={activeIcon === label} staticPositioning>
            {label}
          </Tooltip>
        </span>
      ))}
    </div>
  )
}
export const iconsExamples: ComponentRenders = {
  gallery: {
    render: () => <IconGallery />,
  },
}
