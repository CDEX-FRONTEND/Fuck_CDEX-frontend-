/* eslint-disable array-callback-return */
import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import Toolbar from '../../components/Toolbar';
import RoundedLayout from '../../components/RoundedLayout';
import {
  Box,
  Button,
  Container,
  styled,
} from '@mui/material';
import View from '../../components/View';
import useAppSelector from '../../hooks/useAppSelector';
import TableSellerInfo from './TableSellerInfo';
import MainSallerInfo from './MainSallerInfo';
import { selectUser } from '../../store/userSlice';

const SellerProfile = () => {
  const currentUser = useAppSelector(selectUser);
  const { userId } = useParams<{ userId: string }>();

  return (
    <View>
      <Toolbar />
      <Container>
        <RoundedLayout>
          <MainSallerInfo userId={userId} />
          <Box p='24px'>
            <TableLabel> Купить </TableLabel>
            <TableSellerInfo tableName='bid' userId={userId} currentUser={currentUser} />
            <TableLabel> Продать </TableLabel>
            <TableSellerInfo tableName='ask' userId={userId} currentUser={currentUser} />
          </Box>
        </RoundedLayout>
      </Container>
    </View>
  );
};

export default SellerProfile;


const TableLabel = styled(Box)`
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  padding: 24px 9px 19px 0px;
`;



