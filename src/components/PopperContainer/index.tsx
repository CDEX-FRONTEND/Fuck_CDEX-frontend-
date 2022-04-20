import React from 'react';
import { ClickAwayListener } from "@material-ui/core";
import { Box } from '@mui/material';

interface PopperContainerProps {
  show: boolean,
  onClose: () => void,
}

const PopperContainer: React.FC<PopperContainerProps> = ({ children, show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <ClickAwayListener
      touchEvent={false}
      onClickAway={onClose}
    >
      <Box
        p="25px"
        position="absolute"
        top="calc(100% + 9px)"
        sx={{
          background: '#ffffff',
          boxShadow: '0px 4px 24px rgba(0, 0, 0, 0.1)',
          borderRadius: '20px',
          zIndex: 1,
        }}
      >
        {children}
      </Box>
    </ClickAwayListener>
  );
};

export default PopperContainer;
