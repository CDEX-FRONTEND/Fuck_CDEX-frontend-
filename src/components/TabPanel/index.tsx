import { FC } from 'react';
import { Box } from '@material-ui/core';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => {
  return <Box hidden={value !== index}>{children}</Box>;
};

export { TabPanel };
