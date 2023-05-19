import React from 'react'

import classes from './index.module.scss'

export type Column = {
  accessor: string
  components: {
    Heading: React.ReactNode
    renderCell: (row: any, data: any) => React.ReactNode
  }
}

export type Props = {
  className?: string
  data: any[]
  columns: Column[]
  inDrawer?: boolean
}

const CustomTable: React.FC<Props> = ({ className, data, columns, inDrawer }) => {
  return (
    <div
      className={[classes.table, inDrawer && classes.inDrawer, className && className]
        .filter(Boolean)
        .join(' ')}
    >
      <table cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {columns?.map((col, i) => (
              <th key={i} id={`heading-${col.accessor}`}>
                {col.components.Heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((row: any, rowIndex) => (
              <tr key={rowIndex} className={`row-${rowIndex + 1}`}>
                {columns.map((col, colIndex) => {
                  return (
                    <td key={colIndex} className={`cell-${col.accessor}`}>
                      {col.components.renderCell(row, row[col.accessor])}
                    </td>
                  )
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
