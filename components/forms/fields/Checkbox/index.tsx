import React, { useCallback } from 'react';
import useFieldType from '../../useField';
import Error from '../../Error';
import { Check } from '../../../icons/Check';

import classes from './index.module.scss';

const defaultValidate = (value: boolean, options = {} as any) => {
  if ((value && typeof value !== 'boolean')
    || (options.required && typeof value !== 'boolean')) {
    return 'This field can only be equal to true or false.';
  }

  return true;
};

export const Checkbox: React.FC<{
  path: string
  required?: boolean
  label?: string
  marginBottom?: boolean
}> = (props) => {
  const {
    path,
    required,
    label,
    marginBottom
  } = props;

  const memoizedValidate = useCallback((value) => {
    const validationResult = defaultValidate(value, { required });
    return validationResult;
  }, [required]);

  const {
    value,
    showError,
    errorMessage,
    setValue,
  } = useFieldType({
    path,
    validate: memoizedValidate,
  });

  return (
    <div
      className={[
        classes.checkbox,
        showError && classes.error,
        value && classes.checked,
        marginBottom === false && classes.noMarginBottom
      ].filter(Boolean).join(' ')}
    >
      <div className={classes.errorWrap}>
        <Error
          showError={showError}
          message={errorMessage}
        />
      </div>
      <input
        type="checkbox"
        name={path}
        id={path}
        checked={Boolean(value)}
        readOnly
      />
      <button
        type="button"
        onClick={() => {
          setValue(!value);
        }}
      >
        <span className={classes.input}>
          <Check
            size="large"
            bold
          />
        </span>
        <span className={classes.label}>
          {label}
        </span>
      </button>
    </div>
  );
};
