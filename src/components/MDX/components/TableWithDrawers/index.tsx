import { Drawer, DrawerToggler } from '@components/Drawer'
import { InfoIcon } from '@root/graphics/InfoIcon'

import classes from './index.module.scss'

type Props = {
  columns: string[]
  rows: [
    [
      {
        drawerSlug?: string
        drawerContent?: React.ReactNode
        drawerTitle?: string
        value?: string
      },
    ],
  ]
}

export const TableWithDrawers: React.FC<Props> = ({ columns, rows }) => {
  return (
    <div className={classes.tableWithDrawer}>
      <table cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {columns?.map((label, i) => (
              <th key={i} id={`heading-${label}`}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={`row-${rowIndex + 1}`}>
              {row.map(cell => {
                const { drawerSlug, drawerContent, drawerTitle, value } = cell

                if (drawerSlug && drawerContent) {
                  return (
                    <td>
                      <DrawerToggler className={classes.drawerToggler} slug={drawerSlug}>
                        {value || <InfoIcon />}
                      </DrawerToggler>
                      <Drawer slug={drawerSlug} title={drawerTitle} size="s">
                        {drawerContent}
                      </Drawer>
                    </td>
                  )
                }

                return <td>{value}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
