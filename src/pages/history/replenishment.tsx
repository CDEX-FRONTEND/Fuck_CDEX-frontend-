import { Box, styled, TableRow } from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import classNames from 'classnames';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { PagingTable } from '../../components/PagingTable';
import View from '../../components/View';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  getMyTransactions,
  selectLoading,
  selectMyTransactions,
} from '../../store/walletSlice';
import { StyledTableBodyCell, StyledTableHeadCell } from './styledComponents';

const StyledButton = styled(ButtonUnstyled)`
  background-color: #f5f5f5;
  color: #000000;
  border: 2px solid transparent;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 36px;

  &.active {
    background-color: #ffffff;
    border-color: #cba977;
    color: #cba977;
  }
`;

const Replenishment = () => {
  const dispatch = useAppDispatch();
  const ITEMS_PER_PAGE = 6;

  const [walletFilter, setWalletFilter] = useState<string | undefined>();
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const replenishments = useAppSelector(selectMyTransactions);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(getMyTransactions({ page: 1, take: 100 }));
  }, [dispatch]);

  const WalletFilterButton = ({ walletName }: { walletName: string }) => {
    const nameEquals = walletName === walletFilter;

    return (
      <StyledButton
        className={classNames({ active: nameEquals })}
        onClick={() => updateWalletFilter(walletName)}
      >
        <b>{walletName}</b>
      </StyledButton>
    );
  };

  const items = useMemo(() => {
    const filteredItems = walletFilter
      ? replenishments.filter((item) => item.currencyId === walletFilter)
      : replenishments;

    setTotal(filteredItems.length);

    const sliceStartIndex = (page - 1) * ITEMS_PER_PAGE;
    const sliceEndIndex = page * ITEMS_PER_PAGE;
    return filteredItems.slice(sliceStartIndex, sliceEndIndex);
  }, [page, replenishments, walletFilter]);

  const updateWalletFilter = (walletName: string) => {
    if (walletFilter === walletName) {
      setWalletFilter(undefined);
      return;
    }

    setWalletFilter(walletName);
  };

  const formatDate = (timestamp: string) => {
    return moment(timestamp).format('D.M.YYYY HH:mm:ss');
  };

  const formatDirection = (transactionType: string) => {
    if (transactionType === 'in') return 'Пополнение';
    if (transactionType === 'out') return 'Вывод';
    return 'UNKNOWN';
  };

  const formatTransactionId = (transactionId: string) => {
    return transactionId.split(' ')[2];
  };

  return (
    <View>
      <PagingTable
        loading={loading}
        items={items}
        itemsPerPage={ITEMS_PER_PAGE}
        onChangePage={setPage}
        total={total}
        heads={['Дата \\ Время', 'Тип операции', 'Количество', 'TxID']}
        onHeadRowCell={(item) => (
          <StyledTableHeadCell key={item}>{item}</StyledTableHeadCell>
        )}
        onRow={(transaction, index) => (
          <TableRow key={index}>
            <StyledTableBodyCell>
              {formatDate(transaction.createdAt)}
            </StyledTableBodyCell>
            <StyledTableBodyCell>
              {formatDirection(transaction.direction)}
            </StyledTableBodyCell>
            <StyledTableBodyCell>{transaction.amount}</StyledTableBodyCell>
            <StyledTableBodyCell>
              {formatTransactionId(transaction.txId)}
            </StyledTableBodyCell>
          </TableRow>
        )}
      />
    </View>
  );
};

export default Replenishment;
