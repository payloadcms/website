import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import { Drawer, DrawerToggler } from '@components/Drawer/index'
import { ChevronIcon } from '@root/icons/ChevronIcon/index'
import React from 'react'

import { RichText } from '../index'
import classes from './index.module.scss'

type Props = {
  columns: string[]
  rows: [
    [
      {
        drawerContent?: DefaultTypedEditorState
        drawerDescription?: string
        drawerSlug?: string
        drawerTitle?: string
        value?: DefaultTypedEditorState
      },
    ],
  ]
}

export const TableWithDrawers: (props: Props) => React.JSX.Element = ({ columns, rows }) => {
  return (
    <div className={classes.tableWithDrawer}>
      <table cellPadding="0" cellSpacing="0">
        <thead>
          <tr>
            {columns?.map((label, i) => (
              <th id={`heading-${label}`} key={i}>
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr className={`row-${rowIndex + 1}`} key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const { drawerContent, drawerDescription, drawerSlug, drawerTitle, value } = cell

                if (drawerSlug && drawerContent) {
                  return (
                    <td key={cellIndex}>
                      <DrawerToggler className={classes.drawerToggler} slug={drawerSlug}>
                        {value ? <RichText content={value} /> : <ChevronIcon />}
                      </DrawerToggler>
                      <Drawer
                        className={classes.mdxDrawer}
                        description={drawerDescription}
                        size="s"
                        slug={drawerSlug}
                        title={drawerTitle}
                      >
                        {drawerContent ? <RichText content={drawerContent} /> : null}
                      </Drawer>
                    </td>
                  )
                }

                return <td key={cellIndex}> {value ? <RichText content={value} /> : null}</td>
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
