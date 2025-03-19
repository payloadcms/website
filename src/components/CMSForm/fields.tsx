import { RichText } from '@components/RichText/index'
import { NumberInput } from '@forms/fields/Number/index'
import { ChevronDownIcon } from '@root/icons/ChevronDownIcon/index'
import React from 'react'

import classes from './fields.module.scss'
import { Checkbox } from './fields/Checkbox/index'
import { Select } from './fields/Select/index'
import { Text } from './fields/Text/index'
import { Textarea } from './fields/Textarea/index'

export const fields = {
  checkbox: Checkbox,
  country: (props) => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="country" {...props} />
    )
  },
  email: (props) => {
    return <Text {...props} />
  },
  message: (props) => {
    return <RichText className={classes.message} content={props.message} />
  },
  number: NumberInput,
  select: (props) => {
    return <Select components={{ DropdownIndicator: ChevronDownIcon }} {...props} />
  },
  state: (props) => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="state" {...props} />
    )
  },
  text: Text,
  textarea: Textarea,
}
