import React from 'react';
import useFieldType from '../../useField';
import Error from '../../Error';
import Label from '../../Label';
import { Validate } from '../../types';
import { SetValue } from '../../useField/types';
import classes from './index.module.scss';

export type Option = {
  label: string | React.ReactElement
  value: string
}

const defaultValidate: Validate = (val) => {
  const isValid = Boolean(val);

  if (isValid) return true;

  return 'Please make a selection.';
};

const RadioGroup: React.FC<{
  path: string
  required?: boolean
  validate?: Validate
  label?: string
  options: Option[]
  onChange?: (value: string, setValue: SetValue) => void //eslint-disable-line no-unused-vars
  value?: string
  layout?: 'vertical' | 'horizontal'
}> = (props) => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    options,
    onChange,
    value: valueFromProps,
  } = props;

  const fieldType = useFieldType({
    path,
    validate: required ? validate : undefined,
  });

  const {
    value,
    showError,
    setValue,
    errorMessage,
  } = fieldType;

  const valueToRender = valueFromProps || value;

  return (
    <div className={classes.wrap}>
      <Error
        showError={showError}
        message={errorMessage}
      />
      <Label
        htmlFor={path}
        label={label}
        required={required}
      />
      <ul
        className={[
          classes.group,
        ].join(' ')}
      >
        {options.map((option) => {
          const isSelected = String(option.value) === String(valueToRender);
          const id = `${path}-${option.value}`;

          return (
            <li key={id}>
              <label
                htmlFor={id}
                className={classes.radioWrap}
              >
                <input
                  id={id}
                  type="radio"
                  checked={isSelected}
                  onChange={onChange ? (() => onChange(option.value, setValue)) : (() => {
                    setValue(option.value);
                  })}
                />
                <span className={isSelected ? classes.selected : classes.unselected} />
                <span className={classes.label}>{option.label}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default RadioGroup;
