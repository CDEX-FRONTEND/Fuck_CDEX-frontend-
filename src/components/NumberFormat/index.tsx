import * as React from 'react';
import NumberFormat from 'react-number-format';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  suffix: string;
}

export const NumberFormatCustom = React.forwardRef<NumberFormat, CustomProps>(
  function NumberFormatCustom(props, ref) {
    const { onChange, name, ...other } = props;

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        type="text"
        allowedDecimalSeparators={[',', '.']}
        decimalSeparator="."
        thousandSeparator=" "
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
            },
          });
        }}
        suffix={name}
      />
    );
  }
);
