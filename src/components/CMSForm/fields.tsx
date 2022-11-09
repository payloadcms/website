import { Checkbox } from '@forms/fields/Checkbox'
import { Select } from '@forms/fields/Select'
import { Text } from '@forms/fields/Text'
import { Textarea } from '@forms/fields/Textarea'
import { RichText } from '@components/RichText'

export const fields = {
  text: Text,
  textarea: Textarea,
  select: Select,
  checkbox: Checkbox,
  email: props => {
    return <Text {...props} />
  },
  state: props => {
    return <Select {...props} />
  },
  message: props => {
    return <RichText content={props.message} />
  },
  number: Number,
}
