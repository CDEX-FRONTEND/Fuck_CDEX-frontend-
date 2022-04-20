import classNames from 'classnames';
import { FC, useState } from 'react';
import styles from './style.module.scss';

export interface IMenuItem {
  id: string;
  icon?: any;
  label: string;
}

interface SidebarProps {
  menu: IMenuItem[];
  onMenuItemClick: Function;
  header: any;
  footer: any;
}

const Sidebar: FC<SidebarProps> = ({ header, menu, onMenuItemClick, footer }) => {
  const [tabIndex, setTabIndex] = useState<number>(-1);

  return (
    <div className={styles.Sidebar}>
      <div className={styles['Sidebar-header']}>{header}</div>

      <div className={styles['Sidebar-menu']}>
        {menu.map((item, index) => (
          <div
            key={index}
            className={classNames({
              [styles['Sidebar-menu-item--active']]: index === tabIndex,
              [styles['Sidebar-menu-item']]: index !== tabIndex,
            })}
            onClick={() => {
              setTabIndex(index);

              onMenuItemClick(item);
            }}
          >
            <div className={styles['Sidebar-menu-item-icon']}>
              <img src={item.icon} alt="" />
            </div>
            <div className={styles['Sidebar-menu-item-label']}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
      <div className={styles['Sidebar-footer']}>{footer}</div>
    </div>
  );
};

export { Sidebar };
