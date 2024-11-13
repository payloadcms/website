import { RichText } from '@components/RichText/index.js'
import { NumberInput } from '@forms/fields/Number/index.js'
import { ChevronDownIcon } from '@root/icons/ChevronDownIcon/index.js'
import React from 'react'

import classes from './fields.module.scss'
import { Checkbox } from './fields/Checkbox/index.js'
import { Select } from './fields/Select/index.js'
import { Text } from './fields/Text/index.js'
import { Textarea } from './fields/Textarea/index.js'

export const fields = {
  checkbox: Checkbox,
  country: props => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="country" {...props} />
    )
  },
  email: props => {
    return <Text {...props} />
  },
  message: props => {
    return <RichText className={classes.message} content={props.message} />
  },
  number: NumberInput,
  select: props => {
    return <Select components={{ DropdownIndicator: ChevronDownIcon }} {...props} />
  },
  state: props => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="state" {...props} />
    )
  },
  text: Text,
  textarea: Textarea,
}
