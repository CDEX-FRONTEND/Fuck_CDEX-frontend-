import styled from '@emotion/styled';
import { Box } from '@mui/material';
import React, { FC, MouseEventHandler } from 'react';

interface OverlayProps {
  children: any;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Overlay: FC<OverlayProps> = ({ children, onClick }) => {
  return (
    <>
      <OverlayLayer onClick={onClick ? onClick : () => {}} />
      {children}
    </>
  );
};

const OverlayLayer = styled(Box)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: all 0.3s ease 0s;
`;

export default Overlay;
