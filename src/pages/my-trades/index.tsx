import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  AdvertisementSideEnum,
  getMyTrades,
  getPaymentMethods,
  selectTrades,
  TradeType,
} from '../../store/otcSlice';
import TabsSwitcher from '../../components/TabsSwitcher';
import PagingNavigation from '../../components/PagingNavigation';
import moment from 'moment';
import { Box, styled, Typography } from '@mui/material';
import { PagingTable } from '../../components/PagingTable';
import { AppDispatch } from '../../store';
import { generatePath, useHistory } from 'react-router-dom';
import { selectUser } from '../../store/userSlice';

const getStatus = (index: number) => {
  switch (index) {
    case 1:
      return 'complete';
    case 2:
      return 'cancel';
  }

  return 'open';
};

const MyTrades = () => {
  const trades = useAppSelector(selectTrades);
  const [status, setStatus] = useState<'open' | 'complete' | 'cancel'>('open');
  const loading = useAppSelector((state) => state.otc.loading);
  const dispatch: AppDispatch = useAppDispatch();
  const ITEMS_PER_PAGE = 10;
  const history = useHistory()
  const currentUser = useAppSelector(selectUser);

  useEffect(() => {
    dispatch(
      getPaymentMethods({
        page: 1,
        take: 10,
      })
    );
    dispatch(
      getMyTrades({
        status,
        page: 1,
        take: ITEMS_PER_PAGE,
        orders: [
          {
            field: 'createdAt',
            direction: 'desc',
          },
        ],
      })
    );
  }, [status]);

  return (
    <>
      <Box>
        <TabsSwitcher
          items={['Активные', 'Завершенные', 'Отмененные']}
          onChanged={(index) => setStatus(getStatus(index))}
          defaultValue={0}
        />
      </Box>

      <Box mt="40px">
        <PagingTable
          heads={['Сделка', 'Контрагент', 'Цена', 'Количество', 'Оплата']}
          items={trades}
          itemsPerPage={ITEMS_PER_PAGE}
          onRow={(trade) => (
            <StyledTableRow onClick={() => {
              history.push(generatePath("/trade/:id", {
                id: trade.id
              }))
            }}>
              <StyledTableCell width={265}>
                <StyledTableCellTitle sx={{ fontWeight: '500' }}>
                  {`${trade.advertisement.side === AdvertisementSideEnum.ASK ? 'Продам' : 'Куплю'} ${trade.advertisement.market.mainCurrencyId} за ${trade.advertisement.market.paidCurrencyId}`}
                </StyledTableCellTitle>
                <Box color="#999999">
                  {`#${trade.idNumber} от ${moment(trade.createdAt).format(
                    'DD.MM.YYYY HH:mm'
                  )}`}
                </Box>
              </StyledTableCell>

              <StyledTableCell width={265}>
                {trade.askUserId !== currentUser?.id &&
                  <>
                    <StyledTableCellTitle> {trade.askUser.name} </StyledTableCellTitle>
                    <Box color="#999999"> Покупатель </Box>
                  </>
                }
                {trade.bidUserId !== currentUser?.id &&
                  <>
                    <StyledTableCellTitle> {trade.bidUser.name} </StyledTableCellTitle>
                    <Box color="#999999"> Продавец </Box>
                  </>
                }
              </StyledTableCell>

              <StyledTableCell width={140}>
                <StyledTableCellTitle>
                  {trade.advertisement.factor}%
                </StyledTableCellTitle>
                <Box color="#999999">
                  {trade.advertisement.factor >= 0
                    ? trade.advertisement.side === AdvertisementSideEnum.ASK
                      ? 'Доплачивает покупатель'
                      : 'Вы доплачиваете'
                    : trade.advertisement.side === AdvertisementSideEnum.ASK
                      ? 'Вы доплачиваете'
                      : 'Доплачивает продавец'}
                </Box>
              </StyledTableCell>
              <StyledTableCell width={150}>
                <StyledTableCellTitle>{`${trade.volume} ${trade.advertisement.market.mainCurrencyId}`}</StyledTableCellTitle>
                <Box color="#999999">
                  Комиссия{' '} {trade.sumFee} {' '} {trade.feeSumCurrencyId}
                </Box>
              </StyledTableCell>
              <StyledTableCell width={357}>
                <StyledTableCellTitle>{`${trade.amount} ${trade.advertisement.market.paidCurrencyId}`}</StyledTableCellTitle>
                <Box color="#999999">
                  {trade.advertisement.paymentMethods.length
                    ? trade.advertisement.paymentMethods
                      .map((paymentMethod) => paymentMethod.name)
                      .join(', ')
                    : 'неизвестно'}
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          )}
          onHeadRowCell={(label) => (
            <StyledTableHeadCell>{label}</StyledTableHeadCell>
          )}
          onChangePage={(page: number) => {
            dispatch(
              getMyTrades({
                status,
                page,
                take: ITEMS_PER_PAGE,
                orders: [
                  {
                    field: 'createdAt',
                    direction: 'desc',
                  },
                ],
              })
            );
          }}
          loading={loading}
          maxHeight="700px"
        />
      </Box>
    </>
  );
};

export const StyledTableHeadCell = styled(TableCell)`
  font-style: normal;
  color: #838383 !important;
  border-bottom: 1px solid rgba(39, 42, 47, 0.1) !important;
  white-space: nowrap;
`;

const StyledTableCell = styled(TableCell)`
font-size: 14px;
line-height: 100%;
`
const StyledTableCellTitle = styled(Typography)`
  font-weight: normal;
  font-size: 16px;
  line-height: 100%;
  padding-bottom: 6px;
`

const StyledTableRow = styled(TableRow)`
  &:hover {
    background: rgba(0, 0, 0, 0.05);
    cursor: pointer;
  }
`

export default MyTrades;
