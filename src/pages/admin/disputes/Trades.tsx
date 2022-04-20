import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  TableCell,
  TableRow,
  TextField,
} from '@mui/material';
import SearchIcon from '../../../icons/SearchIcon.svg';
import { AppDispatch, RootState } from '../../../store';
import useAppDispatch from '../../../hooks/useAppDispatch';
import { getTrades, TradeStatusEnum } from '../../../store/otcSlice';
import { PagingTable } from '../../../components/PagingTable';
import useAppSelector from '../../../hooks/useAppSelector';
import moment from 'moment';
import { generatePath, useHistory } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { StyledTableCell, StyledTableRow } from '../Admin.styled';

const Trades = () => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const dispatch: AppDispatch = useAppDispatch();
  const trades = useAppSelector((state: RootState) => state.otc.trades);
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(true);

  const setSearchQueryDebounced = useDebouncedCallback(
    (value) => setSearchQuery(value),
    1500
  );

  useEffect(() => trades && setLoading(false), [trades]);

  useEffect(() => {
    if (searchQuery) {
      setLoading(true);
      dispatch(
        getTrades({
          take: 100,
          page: 1,
          status: [TradeStatusEnum.DISPUTE_OPEN],
          orders: [
            {
              field: 'createdAt',
              direction: 'desc',
            },
          ],
          filters: [
            {
              field: 'id',
              operator: 'ilike',
              value: searchQuery,
            },
          ],
        })
      );
    } else {
      setLoading(true);
      dispatch(
        getTrades({
          take: 100,
          page: 1,
          status: [TradeStatusEnum.DISPUTE_OPEN],
          orders: [
            {
              field: 'createdAt',
              direction: 'desc',
            },
          ],
        })
      );
    }
  }, [searchQuery]);

  const unresolved = useMemo(
    () =>
      trades &&
      trades
        .filter((trade) => trade.status === TradeStatusEnum.DISPUTE_OPEN)
        .filter(
          (trade) => !searchQuery || trade.advertisementId.includes(searchQuery)
        ),
    [trades, searchQuery]
  );

  // const resolved = useMemo(
  //   () =>
  //     trades &&
  //     trades
  //       .filter((trade) => trade.status !== TradeStatusEnum.DISPUTE_COMPLETE)
  //       .filter((trade) => trade.advertisementId.includes(searchQuery)),
  //   [trades, searchQuery]
  // );

  return (
    <Box p="40px">
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <TextField
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearchQueryDebounced(event.target.value);
          }}
          placeholder="Поиск"
          InputProps={{
            endAdornment: (
              <>
                <img src={SearchIcon} />
              </>
            ),
          }}
          variant="standard"
        />
      </Box>

      <Box>
        <Box fontWeight='bold' pb='10px'>Требует решения </Box>

        <PagingTable
          heads={['Сделка', 'Валюта', 'Сумма', 'Дата/Время']}
          items={unresolved}
          onRow={(item) => (
            <StyledTableRow
              onClick={() =>
                history.push(
                  generatePath('/admin/disputes/:id', {
                    id: item.id,
                  })
                )
              }
            >
              <StyledTableCell sx={{ maxWidth: '200px', fontWeight: 'bold' }}>
                {item.id}
              </StyledTableCell>
              <StyledTableCell> {item.advertisement.marketId}</StyledTableCell>
              <StyledTableCell>{item.volume}</StyledTableCell>
              <StyledTableCell>
                {moment(new Date(item.createdAt)).format('DD.MM.YYYY / HH:mm')}
              </StyledTableCell>
            </StyledTableRow>
          )}
          onHeadRowCell={(head) => <TableCell>{head}</TableCell>}
          loading={loading}
        />
      </Box>

      {/* <Box>
        <Box color="#696969">Решенные</Box>
        <PagingTable
          heads={['Сделка', 'Валюта', 'Сумма', 'Дата/Время']}
          items={resolved}
          onRow={(item) => (
            <TableRow>
              <TableCell>{item.advertisementId}</TableCell>
              <TableCell></TableCell>
              <TableCell>{item.volume}</TableCell>
              <TableCell>
                {moment(new Date(item.createdAt)).format('DD.MM.YYYY / HH:mm')}
              </TableCell>
            </TableRow>
          )}
          onHeadRowCell={(head) => <TableCell>{head}</TableCell>}
          loading={loading}
        />
      </Box> */}
    </Box>
  );
};

export { Trades };
