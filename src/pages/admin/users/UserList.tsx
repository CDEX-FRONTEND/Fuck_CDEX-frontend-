import { Box, TableCell, TableRow } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AuthenticationProgress from '../../../components/AuthenticationProgress';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import {
  banUser,
  getStatistic,
  getUsers,
  IUser,
  selectLoading,
  selectTotalUsers,
  selectUsers,
  setError,
  unBanUser,
} from '../../../store/adminSlice';
import SearchIcon from '../../../icons/SearchIcon.svg';
import BanIcon from '../../../icons/BanIcon.svg';
import UnbanIcon from '../../../icons/UnbanIcon.svg';
import usePopup from '../../../hooks/usePopup';
import View from '../../../components/View';
import { generatePath, useHistory } from 'react-router-dom';
import {
  CircularProgress,
  InputAdornment,
  styled,
  TextField,
} from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';
import { PagingTable } from '../../../components/PagingTable';
import { AlertPopup } from '../../../components/AlertPopup';
import { SuccessPopup } from '../../../components/SuccessPopup';
import { RootState } from '../../../store';
import { ErrorPopup } from '../../../components/ErrorPopup';
import { useDebounce } from "use-debounce";
import { formatAveragePaymentTime, formatTradesValues } from "./utils";
import classNames from "classnames";
import { StyledTableCell, StyledTableHeadCell, StyledTableRow } from '../Admin.styled';

const UserList = () => {
  const { setPopup } = usePopup();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debounceSearchQuery] = useDebounce(searchQuery, 500);
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectUsers);
  const loading = useAppSelector(selectLoading);
  const [bannedUsersFilter, setBannedUsersFilter] = useState<boolean>(true);
  const [activeUsersFilter, setActiveUsersFilter] = useState<boolean>(true);
  const ITEMS_PER_PAGE = 10;
  const totalUsers = useAppSelector(selectTotalUsers);
  const history = useHistory();
  const error = useAppSelector((state: RootState) => state.admin.error);

  useEffect(() => {
    dispatch(getStatistic('today'));
    dispatch(
      getUsers({
        page: 1,
        take: ITEMS_PER_PAGE,
        nameFilter: debounceSearchQuery,
        addActiveUsers: activeUsersFilter,
        addBannedUsers: bannedUsersFilter
      })
    );
  }, [debounceSearchQuery, activeUsersFilter, bannedUsersFilter]);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            dispatch(setError(null));
            setPopup(null);
          }}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  const onBan = useCallback(async (user: IUser) => {
    setPopup(
      <AlertPopup
        title="Подтверждение"
        closeable={true}
        onClose={() => setPopup(null)}
        positiveButton="Подтвердить"
        onPositiveButtonClick={async () => {
          if (user.isBanned) {
            const result = await dispatch(unBanUser(user.id._id));
            if (result && result.payload) {
              setPopup(
                <SuccessPopup
                  onClose={() => {
                    setPopup(null);
                  }}
                  message="Пользователь успешно разбанен!"
                />
              );
            }
          } else {
            const result = await dispatch(banUser(user.id._id));
            if (result && result.payload) {
              setPopup(
                <SuccessPopup
                  onClose={() => {
                    setPopup(null);
                  }}
                  message="Пользователь забанен!"
                />
              );
            }
          }

          dispatch(getStatistic('today'));
          dispatch(
            getUsers({
              page: 1,
              take: ITEMS_PER_PAGE,
              nameFilter: debounceSearchQuery,
              addActiveUsers: activeUsersFilter,
              addBannedUsers: bannedUsersFilter
            })
          );
        }}
      >
        {user.isBanned
          ? 'Вы уверенны что хотите разбанить этого пользователя?'
          : 'Вы уверенны что хотите забанить пользователя?'}
      </AlertPopup>
    );
  }, []);

  const onChangePage = useCallback((page: number) => {
    dispatch(
      getUsers({
        page,
        take: ITEMS_PER_PAGE,
        nameFilter: debounceSearchQuery,
        addActiveUsers: activeUsersFilter,
        addBannedUsers: bannedUsersFilter
      })
    );
  }, []);

  const isFiltersInactive = useMemo(() => !activeUsersFilter && !bannedUsersFilter, [activeUsersFilter, bannedUsersFilter]);

  const total = useMemo(() => totalUsers === 0 || isFiltersInactive ? 1 : totalUsers, [totalUsers, isFiltersInactive]);
  const USERS = useMemo(() => isFiltersInactive ? [] : users, [isFiltersInactive, users]);

  console.log(USERS);

  return (
    <View>
      <Box p="40px">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          lineHeight="56px"
        >
          <Box display="flex" gridColumnGap="10px">
            <StyledButton className={classNames({ active: activeUsersFilter })} onClick={() => setActiveUsersFilter(!activeUsersFilter)}>Активные</StyledButton>
            <StyledButton className={classNames({ active: bannedUsersFilter })} onClick={() => setBannedUsersFilter(!bannedUsersFilter)}>Забаненные</StyledButton>
          </Box>

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
        <Box mt="20px">
          {USERS && total ? (
            <PagingTable
              heads={['Имя', 'Аунтефикация', 'Сделки', 'Время перевода', '']}
              onRow={(user) => (
                <StyledTableRow>
                  <StyledTableCell
                    style={{
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      history.push(
                        generatePath('/admin/users/:id', {
                          id: user.id._id,
                        })
                      )
                    }
                  >
                    <b>{user.name}</b>
                  </StyledTableCell>
                  <StyledTableCell>
                    <AuthenticationProgress level={user.userLevel} />
                  </StyledTableCell>
                  <StyledTableCell>{formatTradesValues(user.otc.countComplete, user.otc.countTotal)}</StyledTableCell>
                  <StyledTableCell>
                    {formatAveragePaymentTime(user.otc.averagePaymentTime )}
                  </StyledTableCell>
                  <StyledTableCell>
                    <img
                      src={user.isBanned ? UnbanIcon : BanIcon}
                      alt=""
                      onClick={() => onBan(user)}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </StyledTableCell>
                </StyledTableRow>
              )}
              onHeadRowCell={(item: string) => (
                <StyledTableHeadCell>{item}</StyledTableHeadCell>
              )}
              loading={loading}
              items={USERS}
              itemsPerPage={ITEMS_PER_PAGE}
              total={total}
              maxHeight="600px"
              onChangePage={onChangePage}
            />
          ) : (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              p="60px"
            >
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </View>
  );
};

const StyledButton = styled(ButtonUnstyled)`
  background-color: #f5f5f5;
  color: #000000;
  border: 2px solid transparent;
  padding: 10px 15px;
  min-width: 100px;
  cursor: pointer;
  border-radius: 36px;
  font-size: 16px;
  
  &.active {
    background-color: #ffffff;
    border-color: #cba977;
    color: #cba977;
  }
`;

export { UserList };
