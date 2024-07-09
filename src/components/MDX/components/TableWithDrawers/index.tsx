import { Drawer, DrawerToggler } from '@components/Drawer/index.js'
import { ChevronIcon } from '@root/icons/ChevronIcon/index.js'

import classes from './index.module.scss'

type Props = {
  columns: string[]
  rows: [
    [
      {
        drawerSlug?: string
        drawerContent?: React.ReactNode
        drawerTitle?: string
        drawerDescription?: string
        value?: string
      },
    ],
  ]
}

export const TableWithDrawers: (props) => React.JSX.Element = ({ columns, rows }) => {
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
              {row.map((cell, cellIndex) => {
                const { drawerSlug, drawerContent, drawerTitle, drawerDescription, value } = cell

                if (drawerSlug && drawerContent) {
                  return (
                    <td key={cellIndex}>
                      <DrawerToggler className={classes.drawerToggler} slug={drawerSlug}>
                        {value || <ChevronIcon />}
                      </DrawerToggler>
                      <Drawer
                        slug={drawerSlug}
                        size="s"
                        title={drawerTitle}
                        description={drawerDescription}
                        className={classes.mdxDrawer}
                      >
                        {drawerContent}
                      </Drawer>
                    </td>
                  )
                }

                return <td key={cellIndex}>{value}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
