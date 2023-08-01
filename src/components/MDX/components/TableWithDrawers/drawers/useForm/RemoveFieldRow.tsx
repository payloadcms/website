import * as React from 'react'

import { DrawerCode } from '../../drawerComponents/Code'
import { DrawerCollectionConfig } from '../../drawerComponents/CollectionConfig'

export const UseFormHookRemoveFieldRow = () => {
  return (
    <>
      <h5>
        How to use <code>removeFieldRow</code>
      </h5>
      <DrawerCode
        content={`
import { useForm } from "payload/components/forms";

export const CustomArrayManager = () => {
  const { removeFieldRow } = useForm()

  function removeArrayRow() {
    removeFieldRow({
      path: "arrayField",
      rowIndex: 0,
    })
  }

  return (
    <button
      type="button"
      onClick={removeArrayRow}
    >
      Remove Row
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
