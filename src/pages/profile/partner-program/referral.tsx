import {
  Box,
  TableCell,
  TableRow,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { PagingTable } from '../../../components/PagingTable';

import {
  getReferalProgramInvitedListMy,
  loading,
  selectReferalProgramInvitedListMy,
} from '../../../store/referralProgramSlice';

const Referral = () => {
  const dispatch = useAppDispatch();
  const referralProgramInvitedListMy = useAppSelector(
    selectReferalProgramInvitedListMy
  );
  const isLoading = useAppSelector(loading);
  const theme = useTheme();
  useEffect(() => {
    dispatch(
      getReferalProgramInvitedListMy({
        page: 1,
        take: 20,
      })
    );
  }, []);

  return (
    <Box
      sx={{
        paddingBottom: {
          sm: '24px',
          lg: '0px',
        },
      }}
    >
      <PagingTable
        heads={['ID', 'Общий бонус', 'Рефералы']}
        items={referralProgramInvitedListMy}
        onRow={(item) => (
          <TableRow
            style={{
              cursor: 'pointer',
            }}
          >
            <TableCell>{item.id}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{item.name}</TableCell>
          </TableRow>
        )}
        onHeadRowCell={(head) => <TableCell>{head}</TableCell>}
        loading={isLoading}
      />
    </Box>
  );
};

export default Referral;
