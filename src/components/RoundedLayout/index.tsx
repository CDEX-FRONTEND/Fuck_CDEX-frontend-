import { Box, styled } from '@mui/material';
import React from 'react';

interface RoundedLayoutProps {
  children: any;
};

const RoundedLayout = ({ children }: RoundedLayoutProps) => {
  return (
    <Canvas>
      <Layout>{children}</Layout>
    </Canvas>
  );
};

const Canvas = styled(Box)`
  padding: 24px 0;
`

const Layout = styled(Box)`
  background-color: #ffffff;
  border-radius: 32px;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.06);
`

export default RoundedLayout;
