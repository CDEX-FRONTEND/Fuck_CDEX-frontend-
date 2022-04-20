import React from 'react';
import { styled, Box } from '@mui/material';

export const Header = styled(Box)`
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;

export const Section = styled(Box)`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Paragraph = styled('p')`
  margin: 16px 0;

  &:last-child {
    margin-bottom: 0;
  }
`;
