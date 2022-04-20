/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import React, { useEffect } from 'react';
import NoDataRow from '../../../components/NoDataTableRow';
import SkeletonGenerator from '../../../components/SkeletonGenerator';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import {
  getReferalProgramRewardListMy,
  loading,
  selectReferalProgramRewardListMy,
} from '../../../store/referralProgramSlice';

const Statistic = () => {
  const dispatch = useAppDispatch();
  const theme= useTheme();
  const referalProgramRewardList = useAppSelector(
    selectReferalProgramRewardListMy
  );
  const isLoading = useAppSelector(loading);
  const tableHeadersList = ['Дата / Время', 'Сумма сделки', 'Бонус'];

  useEffect(() => {
    dispatch(
      getReferalProgramRewardListMy({
        page: 1,
        take: 20,
      })
    );
  }, []);

  return (
    <Box sx = {{
      paddingBottom: {
        sm: '24px',
        lg: '0px'
      }
    }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeadersList.map((name, index) => (
                <TableCell key={index} sx= {{color: theme.palette.secondary.dark }}>
                  {name}
                  </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {isLoading ? (
              <SkeletonGenerator cellCount={tableHeadersList.length} />
            ) : referalProgramRewardList.length ? (
              referalProgramRewardList.map((row) => (
                <TableRow>
                  <TableCell>{row.created_at}</TableCell>
                  <TableCell> ожидается добавление</TableCell>
                  <TableCell>{row.reward}</TableCell>
                </TableRow>
              ))
            ) : (
              <NoDataRow colSpan={tableHeadersList.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Statistic;
