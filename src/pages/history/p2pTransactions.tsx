import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  Skeleton,
} from '@mui/material';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getMyTrades, selectTrades, TradeType } from '../../store/otcSlice';
import PagingNavigation from '../../components/PagingNavigation';
import NoDataRow from '../../components/NoDataTableRow';
import moment from 'moment';
import { selectUser } from '../../store/userSlice';
import { StyledTableHeadCell, StyledTableBodyCell } from './styledComponents';

const P2pTransactions = () => {
  const trades = useAppSelector(selectTrades);
  const [status, setStatus] = useState('complete');
  const loading = useAppSelector((state) => state.otc.loading);
  const currentUser = useAppSelector(selectUser);
  const items =
    currentUser && trades.filter((item) => item.advertisement.userId === currentUser.id);
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    dispatch(
      getMyTrades({
        status,
        page: 1,
        take: 20,
      })
    );
  }, [status]);

  const tableCellProperties = ['Сделка', 'Контрагент', 'Количество', 'Сумма / Метод оплаты'];

  const pagesCount = items && Math.ceil(items.length / perPage) || 0;
  const pagination =
    items && items.length > 0 && pagesCount > 0 ? (
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
              (items &&
                items.length > 0 &&
                items.map((trade: TradeType, index) =>
                  (index + 1) <= (page - 1) * perPage || (index + 1) > page * perPage ? (
                    <></>
                  ) : (
                    <TableRow key={index}>
                      <StyledTableBodyCell>
                        <h3>
                          {trade.advertisement.market.mainCurrencyId} за{' '}
                          {trade.advertisement.market.paidCurrencyId}
                        </h3>
                        <StyledTableBodyCellSubtitle>
                          от {moment(trade.createdAt).format('DD.MM.YYYY HH:mm')}
                        </StyledTableBodyCellSubtitle>
                        <StyledTableBodyCellSubtitle>
                          #{trade.advertisement.idNumber}
                        </StyledTableBodyCellSubtitle>
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {trade.askUserId !== currentUser?.id &&
                          <>
                            <h4> {trade.askUser.name} </h4>
                            <StyledTableBodyCellSubtitle> Покупатель </StyledTableBodyCellSubtitle>
                          </>
                        }
                        {trade.bidUserId !== currentUser?.id &&
                          <>
                            <h4> {trade.bidUser.name} </h4>
                            <StyledTableBodyCellSubtitle> Продавец </StyledTableBodyCellSubtitle>
                          </>
                        }
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <h4>
                          {trade.volume}
                        </h4>
                        <StyledTableBodyCellSubtitle>
                          Комиссия{' '} {trade.sumFee} {' '} {trade.feeSumCurrencyId}
                        </StyledTableBodyCellSubtitle>
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <h4>
                          {trade.amount}
                        </h4>
                        <StyledTableBodyCellSubtitle>
                          {trade.advertisement.paymentMethods
                            .map((paymentMethod) => paymentMethod.name)
                            .join(', ')}
                        </StyledTableBodyCellSubtitle>
                      </StyledTableBodyCell>
                    </TableRow>
                  )
                )) || <NoDataRow colSpan={tableCellProperties.length} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {pagination}
    </>
  );
};

const StyledTableBodyCellSubtitle = styled('span')`
  margin-top: 7px;
  display: block;
  color: #000000 !important;
  opacity: 0.4;
`;

export default P2pTransactions;
