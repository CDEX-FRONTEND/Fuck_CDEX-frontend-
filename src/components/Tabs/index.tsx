import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { useAdaptiveStyles } from './adaptive.styles';
import styles from './style.module.scss';

interface TabsProps {
  items: any[];
  onChange?: (item: string) => void;
  onChanged?: (index: number) => void;
  defaultValue?: number;
  outline?: boolean;
  tab?: number;
  vertical?: boolean;
  bordered?: boolean;
}

const Tabs = ({
  items,
  defaultValue,
  onChange,
  onChanged,
  outline,
  tab,
  vertical,
  bordered,
}: TabsProps) => {
  const [active, setActive] = useState<number>(defaultValue ? defaultValue : 0);
  const [item, setItem] = useState<string>("");
  const adaptiveStyles = useAdaptiveStyles();

  useEffect(()=> onChange && onChange(item), [item]);
  useEffect(() => onChanged && onChanged(active), [active]);
  useEffect(() => {
    if (tab) {
      setActive(tab);
    }
  }, [tab]);

  const activeTab = tab ? tab : active;

  return (
    <div
      className={classNames({
        [adaptiveStyles.Tabs]: true,
        [styles.TabsVertical]: vertical,
      })}
    >
      {items.map((item, index) => (
        <div
        key={index}
          className={classNames({
            [styles['Tabs-item']]: !outline,
            [styles['Tabs-item--active']]: activeTab === index && !outline,
            [styles['Tabs-item-outline']]: outline,
            [styles['Tabs-item--active-outline']]:
              activeTab === index && outline,
            [styles['Tabs-item--bordered']]: bordered,
          })}
          onClick={() => {
            setActive(index)
            setItem(item)
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
