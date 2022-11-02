import { Checkbox } from '@components/forms/fields/Checkbox'
import { Select } from '@components/forms/fields/Select'
import { Text } from '@components/forms/fields/Text'
import { Textarea } from '@components/forms/fields/Textarea'
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
