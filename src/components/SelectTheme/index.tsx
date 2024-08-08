import React from 'react'

import * as Select from '@radix-ui/react-select'
import classes from './index.module.scss'

import { ThemeAutoIcon } from '@root/graphics/ThemeAutoIcon/index.js'
import { ThemeDarkIcon } from '@root/graphics/ThemeDarkIcon/index.js'
import { ThemeLightIcon } from '@root/graphics/ThemeLightIcon/index.js'
import { ChevronUpDownIcon } from '@root/icons/ChevronUpDownIcon/index.js'

export const SelectTheme = ({
  themeId,
  onThemeChange,
}: {
  selectRef: any
  themeId: string
  onThemeChange: (e: string) => void
}) => {
  const [selectedValue, setSelectedValue] = React.useState('auto')
  const selectRef = React.useRef<HTMLButtonElement>(null)

  const handleValueChange = value => {
    setSelectedValue(value)
    onThemeChange(value)
  }

  return (
    <Select.Root onValueChange={handleValueChange}>
      <Select.Trigger className={classes.SelectTrigger} ref={selectRef} id={themeId}>
        {selectRef?.current && (
          <div className={`${classes.themeIcons} ${classes.themeIcon}`}>
            {selectedValue === 'auto' && <ThemeAutoIcon />}
            {selectedValue === 'light' && <ThemeLightIcon />}
            {selectedValue === 'dark' && <ThemeDarkIcon />}
          </div>
        )}

        <Select.Value placeholder="Auto" id="value"></Select.Value>
        <ChevronUpDownIcon className={`${classes.switcherIcon} ${classes.upDownChevronIcon}`} />
      </Select.Trigger>

      <Select.Portal>
        <Select.Content align="start" position="popper" className={classes.SelectContent}>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Item value="auto" className={classes.SelectItem}>
              <Select.ItemText>Auto</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
            <Select.Item value="light" className={classes.SelectItem}>
              <Select.ItemText>Light</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
            <Select.Item value="dark" className={classes.SelectItem}>
              <Select.ItemText>Dark</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          </Select.Viewport>
          <Select.ScrollDownButton />
          <Select.Arrow />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}
