'use client'
import React, { useEffect, useRef, useState } from 'react'

import classes from './index.module.scss'

export type Column = {
  accessor: string
  components: {
    Heading: React.ReactNode
    renderCell: (row: any, data: any) => React.ReactNode
  }
}

export type Props = {
  bleedToEdge?: boolean
  className?: string
  columns: Column[]
  data: any[]
  inDrawer?: boolean
}

const CustomTable: React.FC<Props> = ({ className, columns, data, inDrawer }) => {
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
              <th className={`heading-${col.accessor}`} key={i}>
                {col.components.Heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((row: any, rowIndex) => (
              <tr className={`row-${rowIndex + 1}`} key={rowIndex}>
                {columns.map((col, colIndex) => {
                  return (
                    <td className={`cell-${col.accessor}`} key={colIndex}>
                      {col.components.renderCell(row, row[col.accessor])}
                    </td>
                  )
                })}
                <div className={classes.cellBG} />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
