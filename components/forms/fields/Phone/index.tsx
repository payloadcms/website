import React, { useCallback } from 'react';
import useFieldType from '../../useFormField';
import Error from '../../Error';
import Label from '../../Label';
import { Validate } from '../../types';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';

import classes from './index.module.scss';

const defaultValidate: Validate = (val) => {
  const stringVal = val as string;
  const isValid = stringVal && stringVal.length > 0;

  if (isValid) {
    return true;
  }

  return 'Please enter a value.';
};

export const Phone: React.FC<{
  path: string
  required?: boolean
  validate?: Validate
  label?: string
  placeholder?: string
  onChange?: (value: number) => void // eslint-disable-line no-unused-vars
  marginBottom?: boolean
}> = (props) => {
  const {
    path,
    required = false,
    validate = defaultValidate,
    label,
    placeholder,
    onChange,
    marginBottom,
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

  const handleChange = useCallback((value) => {
    setValue(value);
    if (typeof onChange === 'function') onChange(value)
  }, [
    onChange,
    setValue
  ])

  return (
    <div
      className={[
        classes.wrap,
        marginBottom === false && classes.noMarginBottom
      ].filter(Boolean).join(' ')}
    >
      <Error
        showError={showError}
        message={errorMessage}
      />
      <Label
        htmlFor={path}
        label={label}
        required={required}
      />
      <PhoneInput
        className={classes.phone}
        value={value as any || null}
        onChange={handleChange}
        placeholder={placeholder}
        defaultCountry="US"
        id={path}
        name={path}
      />
    </div>
  );
};
