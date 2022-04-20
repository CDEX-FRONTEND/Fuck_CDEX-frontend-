import classNames from 'classnames';
import { useState } from 'react';
import styles from './style.module.scss';

interface CommissionProps {
  onChanged: (value: number) => void;
}

const Commission = ({ onChanged }: CommissionProps) => {
  const [value, setValue] = useState<number|null>();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      {Array.from(Array(4).keys()).map((_, i) => (
        <button
          className={classNames({
            [styles.InputButton]: true,
            [styles.InputButtonSelected]:
              value === i,
          })}
          onClick={() => {
              if (i === value && value > -1) {
                setValue(-1)
                onChanged(0);
              } else {
                setValue(i);
                onChanged((1 + i) * 25);
              }
          }}
        >
          {`${(1 + i) * 25}%`}
        </button>
      ))}
    </div>
  );
};

export { Commission };
