import {
  styled,
} from '@mui/material';
import {
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
  tabUnstyledClasses,
} from '@mui/base';
import React, { useEffect, useState } from 'react';

interface TabsProps {
  items: string[];
  onChanged?: (index: number) => void;
  defaultValue?: number;
  tab?: number;
}

const TabsSwitcher = ({ items, defaultValue, tab, onChanged }: TabsProps) => {
  const [active, setActive] = useState(defaultValue ? defaultValue : 0);
  useEffect(() => onChanged && onChanged(active), [active]);
  useEffect(() => {
    if (tab) {
      setActive(tab);
    }
  }, [tab]);

  return (
    <TabsUnstyled defaultValue={active}>
      <StyledTabsList
        sx={{
          height: {
            sm: 'auto',
            md: '44px',
          },
          flexDirection: {
            sm: 'column',
            md: 'row',
          },
          gap: {
            sm: '10px',
            md: '0'
          }
        }}
      >
        {items.map((item, index) => (
          <StyledTab onClick={() => setActive(index)} sx={{
            width: {
              sm: '100%',
              md: 'auto'
            },
            padding: {
              sm: '10px 0',
              md: '0'
            }
          }}>{item}</StyledTab>
        ))}
      </StyledTabsList>
    </TabsUnstyled>
  );
};

const StyledTabsList = styled(TabsListUnstyled)`
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
  border-radius: 20px;
`;

const StyledTab = styled(TabUnstyled)`
  background-color: #f5f5f5;
  flex: 1;
  text-align: center;
  border-radius: 14px;
  border: 0;
  height: 100%;
  cursor: pointer;
  color: rgba(143, 137, 130, 1);
  font-size: 16px;
  &.${tabUnstyledClasses.selected} {
    color: ${(props) => props.theme.palette.primary.main};
    font-weight: 600;
    background-color: #ffffff;
  }
`;

export default TabsSwitcher;
