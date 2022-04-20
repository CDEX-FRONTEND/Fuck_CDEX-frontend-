import React, { useEffect, useMemo, useState } from 'react';
import { Box, TableCell, TableRow, TextField } from '@mui/material';
import SearchIcon from '../../../icons/SearchIcon.svg';
import { AppDispatch, RootState } from '../../../store';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import {
  getComplaints,
  getReasons,
} from '../../../store/complaintSlice';
import { PagingTable } from '../../../components/PagingTable';
import { generatePath, useHistory } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import Tabs from '../../../components/Tabs';
import moment from 'moment';
import { StyledTableCell, StyledTableRow } from '../Admin.styled';

const ComplaintsList = () => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const dispatch: AppDispatch = useAppDispatch();
  const reasons = useAppSelector((state: RootState) => state.complaint.reasons);
  const complaints = useAppSelector(
    (state: RootState) => state.complaint.complaints
  );
  const loading = useAppSelector((state: RootState) => state.complaint.loading);
  const history = useHistory();

  const setSearchQueryDebounced = useDebouncedCallback(
    (value) => setSearchQuery(value),
    1500
  );

  useEffect(() => {
    dispatch(getReasons());
    dispatch(
      getComplaints({
        page: 1,
        take: 10,
        reasonId: reasons[0]?.id,
      })
    );
  }, []);

  const handleChange = (item: string) => {
    reasons &&
      reasons.find((reason) => {
        if (reason.name === item) {
          dispatch(
            getComplaints({
              page: 1,
              take: 10,
              reasonId: reason.id,
            })
          );
        }
      });
  };

  return (
    <Box p="40px" height="100%">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb="40px"
      >
        <Tabs
          items={reasons && reasons.map((item) => item.name)}
          onChange={handleChange}
          bordered
        />
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
        <PagingTable
          heads={['Пользователь', 'Причина', 'Раздел', 'Дата/Время']}
          items={complaints}
          onRow={(item) => (
            <StyledTableRow
              onClick={() =>
                history.push(
                  generatePath('/admin/complaints/:id', {
                    id: item.id
                  })
                )
              }
              style={{
                cursor: 'pointer',
              }}
            >
              <StyledTableCell>
                <b>{item.complaintUserName} </b>
              </StyledTableCell>
              <StyledTableCell>{item.complaintReasonName}</StyledTableCell>
              <StyledTableCell>{item.module}</StyledTableCell>
              <StyledTableCell>
                {moment(new Date(item.createdAt)).format('DD.MM.YYYY / HH:mm')}
              </StyledTableCell>
            </StyledTableRow>
          )}
          onHeadRowCell={(head) => <TableCell>{head}</TableCell>}
          loading={loading}
        />
      </Box>
    </Box>
  );
};
export { ComplaintsList };
