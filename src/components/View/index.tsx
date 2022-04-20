import React, { FC } from 'react';
import { Box } from '@mui/material';
import usePopup from '../../hooks/usePopup';

interface IViewProps {
  children: any;
}

const View: FC<IViewProps> = ({ children }) => {
  const { popup } = usePopup();

  return (
    <Box height="100%">
      {popup}
      {children}
    </Box>
  );
};

export default View;
