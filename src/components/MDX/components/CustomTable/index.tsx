'use client'
import React, { useState, useRef, useEffect } from 'react'

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
  bleedToEdge?: boolean
}

const CustomTable: React.FC<Props> = ({
  className,
  data,
  columns,
  inDrawer,
  bleedToEdge = true,
}) => {
  const [padding, setPadding] = useState(0)
  const paddingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (bleedToEdge) {
      if (paddingRef.current?.offsetWidth === undefined) return
      setPadding(Math.round(paddingRef.current?.offsetWidth / 8) - 1)
    }
  }, [paddingRef.current?.offsetWidth, bleedToEdge])

  return (
    <div
      className={[classes.table, inDrawer && classes.inDrawer, className && className]
        .filter(Boolean)
        .join(' ')}
      ref={paddingRef}
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
                <div
                  className={classes.cellBG}
                  style={
                    bleedToEdge
                      ? {
                          marginLeft: padding / -1,
                          marginRight: padding / -1,
                        }
                      : {}
                  }
                />
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
