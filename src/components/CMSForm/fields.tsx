import { NumberInput } from '@forms/fields/Number/index.js'

import { RichText } from '@components/RichText/index.js'
import { ChevronDownIcon } from '@root/icons/ChevronDownIcon/index.js'
import { Checkbox } from './fields/Checkbox/index.js'
import { Select } from './fields/Select/index.js'
import { Text } from './fields/Text/index.js'
import { Textarea } from './fields/Textarea/index.js'

import classes from './fields.module.scss'

export const fields = {
  text: Text,
  textarea: Textarea,
  select: props => {
    return <Select components={{ DropdownIndicator: ChevronDownIcon }} {...props} />
  },
  checkbox: Checkbox,
  email: props => {
    return <Text {...props} />
  },
  country: props => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="country" {...props} />
    )
  },
  state: props => {
    return (
      <Select components={{ DropdownIndicator: ChevronDownIcon }} selectType="state" {...props} />
    )
  },
  message: props => {
    return <RichText className={classes.message} content={props.message} />
  },
  number: NumberInput,
}
