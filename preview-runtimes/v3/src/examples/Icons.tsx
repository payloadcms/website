import {
  CalendarIcon,
  CheckIcon,
  ChevronIcon,
  CloseMenuIcon,
  CodeBlockIcon,
  CopyIcon,
  DocumentIcon,
  DragHandleIcon,
  EditIcon,
  ExternalLinkIcon,
  FolderIcon,
  GearIcon,
  GridViewIcon,
  LineIcon,
  LinkIcon,
  ListViewIcon,
  LogOutIcon,
  MenuIcon,
  MinimizeMaximizeIcon,
  MoreIcon,
  MoveFolderIcon,
  PlusIcon,
  SearchIcon,
  SwapIcon,
  XIcon,
} from '@payloadcms/ui'
import { Tooltip } from '@payloadcms/ui/elements/Tooltip'
import { useState } from 'react'

import type { ComponentExamples } from './types'

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
  { Icon: ExternalLinkIcon, label: 'ExternalLinkIcon' },
  { Icon: FolderIcon, label: 'FolderIcon' },
  { Icon: GearIcon, label: 'GearIcon' },
  { Icon: GridViewIcon, label: 'GridViewIcon' },
  { Icon: LineIcon, label: 'LineIcon' },
  { Icon: LinkIcon, label: 'LinkIcon' },
  { Icon: ListViewIcon, label: 'ListViewIcon' },
  { Icon: LogOutIcon, label: 'LogOutIcon' },
  { Icon: MenuIcon, label: 'MenuIcon' },
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

export const iconsExamples: ComponentExamples = {
  gallery: {
    code: `import { CopyIcon, EditIcon, PlusIcon, SearchIcon } from '@payloadcms/ui'

export function Toolbar() {
  return (
    <div className="toolbar">
      <span aria-hidden="true"><PlusIcon /></span>
      <span aria-hidden="true"><EditIcon /></span>
      <span aria-hidden="true"><CopyIcon /></span>
      <span aria-hidden="true"><SearchIcon /></span>
    </div>
  )
}`,
    design: {
      code: `.toolbar-icon {
  color: var(--theme-text);
  display: inline-flex;
}

.toolbar-icon svg {
  height: 1.25rem;
  width: 1.25rem;
}

.toolbar-icon:hover {
  color: var(--theme-elevation-600);
}`,
      description:
        'Icons use currentColor, so set color on a wrapper to follow your theme. Target the nested SVG only when the surrounding layout requires a consistent size.',
      variables: [
        { name: 'color', description: 'Stroke or fill color inherited by the icon.' },
        { name: 'height', description: 'Rendered icon height.' },
        { name: 'width', description: 'Rendered icon width.' },
      ],
    },
    render: () => <IconGallery />,
  },
}
