import React, { useEffect } from 'react';
import styles from './style.module.scss';

interface PartitionedInputProps {
  value: string | undefined;
  onValueChange: (inputValue: string) => void;
  maxLength?: number;
}

const PartitionedInput = ({
  value,
  onValueChange,
  maxLength = 6,
}: PartitionedInputProps) => {
  const partitionedCodeField = document.getElementById(
    'partitionedCodeField'
  ) as HTMLInputElement;

  const setCaretPosition = (elem: any, caretPos: any) => {
    if (elem != null) {
      if (elem.createTextRange) {
        const range = elem.createTextRange();
        range.move('character', caretPos);
        range.select();
      } else {
        if (elem.selectionStart) {
          elem.focus();
          elem.setSelectionRange(caretPos, caretPos);
        } else elem.focus();
      }
    }
  };

  const stopCarret = () => {
    if (partitionedCodeField?.value.length > maxLength - 1) {
      setCaretPosition(partitionedCodeField, maxLength - 1);
    }
  };

  useEffect(() => {
    partitionedCodeField?.addEventListener('keydown', stopCarret);
    partitionedCodeField?.addEventListener('keyup', stopCarret);
  }, []);

  return (
    <div style={{ overflow: 'hidden', width: `${48 * maxLength}px` }}>
      <div className={styles.divInner}>
        <input
          className={styles.partitionedCodeField}
          type="text"
          maxLength={maxLength}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onValueChange(event.target.value)
          }
        />
      </div>
    </div>
  );
};

export default PartitionedInput;
