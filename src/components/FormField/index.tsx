import React from 'react';
import { TextField } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import styles from './style.module.scss';
import clsx from 'classnames';

interface FormFieldProps {
  name: any;
  label?: string;
  type?: 'text' | 'password';
  placeholder?: string;
  className?: string;
  disabled?:boolean;
  value?: string | number;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type,
  placeholder,
  className,
  disabled,
  value,
}) => {

  const { register, formState } = useFormContext();

  return (
    <TextField
      {...register(name)}
      name={name}
      label={label}
      type={type}
      placeholder={placeholder}
      error={!!formState.errors[name]?.message}
      helperText={formState.errors[name]?.message}
      className={clsx(className, styles.formControlItem)}
      disabled={disabled}
      value={value}
      variant="standard"
      InputProps={{
        classes: { 
          input: styles.inputStyles 
        }
      }}
      InputLabelProps={{
        classes: {
          root: styles.inputStyles,
        },
      }}
    />
  );
};
