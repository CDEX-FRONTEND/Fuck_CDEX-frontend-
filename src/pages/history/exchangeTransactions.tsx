import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Skeleton
} from '@mui/material';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getMyOrders, selectMyOrders } from '../../store/orderSlice';
import { OrderType } from '../../store/orderSlice';
import PagingNavigation from '../../components/PagingNavigation';
import NoDataRow from '../../components/NoDataTableRow';
import moment from 'moment';
import { StyledTableHeadCell, StyledTableBodyCell } from './styledComponents';

const ExchangeTransactions = () => {
  const myOrders = useAppSelector(selectMyOrders);
  const [market, setMarket] = useState('BTCRUB');
  const loading = useAppSelector((state) => state.market.loading);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      getMyOrders({
        page: 1,
        take: 20,
        marketId: market,
      })
    );
  }, [market]);

  const tableCellProperties = [
    'Дата \\ Время',
    'Пара',
    'Сторона',
    'Цена',
    'Количество',
    'Комиссия',
    'Сумма сделки',
  ];

  const pagesCount = Math.ceil(myOrders.length / perPage);
  const pagination =
    myOrders.length > 0 && pagesCount > 1 ? (
      <PagingNavigation
        pagesCount={pagesCount}
        selectedPage={page}
        onSelectPage={(_, page) => {
          setPage(page);
        }}
      />
    ) : (
      ''
    );

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {tableCellProperties.map((cellProperty: string) => (
                <StyledTableHeadCell key={cellProperty}>
                  {cellProperty}
                </StyledTableHeadCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  {tableCellProperties.map(() => (
                    <StyledTableBodyCell>
                      <Skeleton variant="rectangular" />
                    </StyledTableBodyCell>
                  ))}
                </TableRow>
              </>
            ) : (
              (myOrders &&
                myOrders.length > 0 &&
                myOrders.map((order: OrderType, index) => (
                (index + 1) <= (page - 1) * perPage || (index + 1) > page * perPage ? (
                  <></>
                ) : (
                  <TableRow>
                  <StyledTableBodyCell>
                    {moment(order.created_at).format('DD.MM.YYYY HH:mm')}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {order.market_id}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {order.side === 'ask' ? 'Покупка' : 'Продажа'}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {order.price}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {order.volume}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {order.executedAmount}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {order.price}
                  </StyledTableBodyCell>
                  </TableRow>
                )))) || (
                <>
                  <NoDataRow colSpan={tableCellProperties.length} />
                </>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination}
    </>
  );
};

export default ExchangeTransactions;
