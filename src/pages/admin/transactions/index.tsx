/* eslint-disable @typescript-eslint/no-unused-vars */
import moment from 'moment';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, Route, Switch, useHistory } from 'react-router-dom';
import useAppSelector from '../../../hooks/useAppSelector';
import SearchIcon from '../../../icons/SearchIcon.svg';
import {
  getTransactionList,
  selectTransactionList,
  setTransaction,
  Transaction,
} from '../../../store/walletSlice';
import { Trans } from '../Trans';
import {
  Box,
  CircularProgress,
  InputAdornment,
  TextField,
  styled,
} from '@mui/material';
import {
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
  tabUnstyledClasses,
} from '@mui/base';
import { PagingTable } from '../../../components/PagingTable';
import { StyledTableCell, StyledTableHeadCell, StyledTableRow } from '../Admin.styled';

const Transactions = () => {
  const history = useHistory();
  const [tab, setTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string | undefined>();
  const transactions = useAppSelector(selectTransactionList);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();
  const direction = useMemo(() => (tab === 0 ? 'in' : 'out'), [tab]);
  const uncompletedTransactions = useMemo(
    () =>
      transactions
        .filter(
          (el) =>
            ['new', 'confirm:wait'].includes(el.status) &&
            el.direction === direction
        )
        .filter((item) =>
          searchQuery ? item.txId.includes(searchQuery) : item
        )
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA > dateB ? -1 : 1;
        }),
    [transactions, searchQuery]
  );

  const completedTransactions = useMemo(
    () =>
      transactions
        .filter(
          (el) =>
            ['error', 'complete', 'reject', 'confirm'].includes(el.status) &&
            el.direction === direction
        )
        .filter((item) =>
          searchQuery ? item.txId.includes(searchQuery) : item
        )
        .sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA > dateB ? -1 : 1;
        }),
    [transactions, searchQuery]
  );

  const onRowClick = useCallback((item: Transaction, index: number) => {
    dispatch(setTransaction(null));

    history.push(
      generatePath('/admin/transactions/:id', {
        id: item.id,
      })
    );
  }, []);

  useEffect(() => transactions && setLoading(false), [transactions]);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      dispatch(
        getTransactionList({
          direction,
          status: '',
          page: 1,
          take: 20,
        })
      );
    }, 1000);
  }, [tab]);

  return (
    <Switch>
      <Route exact path="/admin/transactions">
        <Box p="40px">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            lineHeight="56px"
          >
            <TabsUnstyled
              value={tab}
              onChange={(
                event: React.SyntheticEvent,
                newValue: string | number
              ) => {
                !loading && setTab(Number(newValue));
              }}
            >
              <StyledTabsList>
                <StyledTab>Ввод</StyledTab>
                <StyledTab>Вывод</StyledTab>
              </StyledTabsList>
            </TabsUnstyled>
            <TextField
              placeholder="Поиск"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <img src={SearchIcon} alt="" />
                  </InputAdornment>
                ),
              }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(event.target.value)
              }
              variant="standard"
            />
          </Box>

          <Box height="100%">
            <Box fontWeight="bold" my="25px">
              {`Требует подтверждения (${loading ? 0 : uncompletedTransactions.length
                })`}
            </Box>

            <PagingTable
              heads={['TxID', 'Валюта', 'Сумма', 'Контрагент', 'Дата / Время']}
              items={uncompletedTransactions}
              onRow={(item, index: number) => (
                <StyledTableRow
                  key={index}
                  onClick={() => onRowClick(item, index)}
                >
                  <StyledTableCell sx={{ maxWidth: '250px', fontWeight: 'bold' }}>
                    {item.txId}
                  </StyledTableCell>
                  <StyledTableCell>{item.currencyId}</StyledTableCell>
                  <StyledTableCell>{item.amount}</StyledTableCell>
                  <StyledTableCell>{item.userName}</StyledTableCell>
                  <StyledTableCell>
                    {moment(item.createdAt).format('D.M.YYYY HH:mm:ss')}
                  </StyledTableCell>
                </StyledTableRow>
              )}
              loading={loading}
              onHeadRowCell={(item) => (
                <StyledTableHeadCell>{item}</StyledTableHeadCell>
              )}
            />

            <Box fontWeight="bold" my="25px">
              {`Подтвержденные (${loading ? 0 : completedTransactions.length})`}
            </Box>

            <PagingTable
              heads={['TxID', 'Валюта', 'Сумма', 'Контрагент', 'Дата / Время']}
              items={completedTransactions}
              onRow={(item, index: number) => (
                <StyledTableRow
                  key={index}
                  onClick={() => onRowClick(item, index)}
                >
                  <StyledTableCell  sx={{ maxWidth: '250px', fontWeight: 'bold' }}>
                    {item.txId}
                  </StyledTableCell>
                  <StyledTableCell>{item.currencyId}</StyledTableCell>
                  <StyledTableCell>{item.amount}</StyledTableCell>
                  <StyledTableCell>{item.userName}</StyledTableCell>
                  <StyledTableCell>
                    {moment(item.createdAt).format('D.M.YYYY HH:mm:ss')}
                  </StyledTableCell>
                </StyledTableRow>
              )}
              loading={loading}
              onHeadRowCell={(item) => (
                <StyledTableHeadCell>{item}</StyledTableHeadCell>
              )}
            />
          </Box>
        </Box>
      </Route>
      <Route exact path="/admin/transactions/:id" component={Trans} />
    </Switch>
  );
};

const StyledTab = styled(TabUnstyled)`
  background-color: #f5f5f5;
  color: #000000;
  border: 2px solid transparent;
  padding: 10px 15px;
  min-width: 100px;
  cursor: pointer;
  border-radius: 36px;
  font-size: 16px;
  &.${tabUnstyledClasses.selected} {
    background-color: #ffffff;
    border-color: #cba977;
    color: #cba977;
  }
`;

const StyledTabsList = styled(TabsListUnstyled)`
  display: flex;
  gap: 10px;
`;


export default Transactions;
