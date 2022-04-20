import React from 'react';
import { Box, styled } from '@mui/material';

interface TabItemProps {
  isActive: boolean;
  icon: string;
  label: string;
  onClick?: () => void; 
}

const TabItem: React.FC<TabItemProps> = ({ icon, label, isActive, onClick }) => (
  <TableRow
    display="table-row"
  >
    <Box
      display="table-cell"
      pr="12px"
      pb="25px"
      textAlign="center"
    >
      <Box
        component="img"
        alt=""
        src={icon}
        sx={{ verticalAlign: 'middle' }}
      />
    </Box>
    <Box
      display="table-cell"
      pb="25px"
      whiteSpace="nowrap"
      sx={{
        color: isActive ? 'primary.main' : '#9E9E9E', 
        fontWeight: isActive ? 'bold' : 'normal',
        verticalAlign: 'middle',
      }}
    >
      <span
        style={{ cursor: "pointer" }}
        onClick={() => onClick && onClick()}>
          {label}
      </span>
    </Box>
  </TableRow>
);

const TableRow = styled(Box)`
  &:last-child > * {
    padding-bottom: 0;
  }
`;

export default TabItem;