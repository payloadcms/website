import * as React from 'react'

import { DrawerCode } from '../../drawerComponents/Code'
import { DrawerCollectionConfig } from '../../drawerComponents/CollectionConfig'

export const UseFormHookAddFieldRow = () => {
  return (
    <>
      <h5>
        How to use <code>addFieldRow</code>
      </h5>
      <DrawerCode
        content={`
import { useForm } from "payload/components/forms";

export const CustomArrayManager = () => {
  const { addFieldRow } = useForm()

  function addArrayRow() {
    addFieldRow({
      path: "arrayField",
      rowIndex: 0,
      data: {
        textField: "text",
      },
      // blockType: "yourBlockSlug",
      // ^ if managing a block array, you need to specify the block type
    })
  }

  return (
    <button
      type="button"
      onClick={addArrayRow}
    >
      Add Row
    </button>
  )
}
`}
      />
      <br />
      <DrawerCollectionConfig type="array-example" />
    </>
  )
}
