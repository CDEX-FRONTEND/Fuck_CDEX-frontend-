import {
  Box,
  Button,
  CircularProgress,
  FormLabel,
  styled,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import {
  TabsListUnstyled,
  TabsUnstyled,
  TabUnstyled,
  tabUnstyledClasses
} from '@mui/base';
import { useCallback, useEffect, useState } from 'react';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import { AlertPopup } from '../../../components/AlertPopup';
import BackButton from '../../../components/BackButton';
import { ErrorPopup } from '../../../components/ErrorPopup';
import { PagingTable } from '../../../components/PagingTable';
import { SuccessPopup } from '../../../components/SuccessPopup';
import { TabPanel } from '../../../components/TabPanel';
import View from '../../../components/View';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import usePopup from '../../../hooks/usePopup';
import { AppDispatch, RootState } from '../../../store';
import {
  banUser, getUser,
  selectUser,
  setError,
  unBanUser,
} from '../../../store/adminSlice';
import {
  getAdvertisementList,
  getAdvertisementSellerInfo,
  selectAdvertisements,
  setAdvertisementSellerInfo,
} from '../../../store/otcSlice';
import { formatAveragePaymentTime, formatTradesValues } from './utils';

const User = () => {
  const { id } = useParams<{ id: string }>();

  const history = useHistory();
  const dispatch: AppDispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const advertisements = useAppSelector(selectAdvertisements);
  const [tab, setTab] = useState<number>(0);
  const { setPopup } = usePopup();
  const error = useAppSelector((state: RootState) => state.admin.error);

  useEffect(() => {
    if (id) {
      dispatch(getUser(id));
      dispatch(
        getAdvertisementList({
          userId: id,
          page: 1,
          take: 10,
        })
      );
    }
  }, [id]);

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

  const onBan = useCallback(() => {
    if (user) {
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
                dispatch(getAdvertisementSellerInfo(id));
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
                dispatch(getAdvertisementSellerInfo(id));
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
          }}
        >
          {user.isBanned
            ? 'Вы уверенны, что хотите разбанить этого пользователя?'
            : 'Вы уверенны, что хотите забанить пользователя?'}
        </AlertPopup>
      );
    }
  }, [user]);

  const getUserAuth = useCallback(() => {
    const result: string[] = [];

    if (!user || user.userLevel === 0) {
      result.push('Нет защиты');
      return result;
    }

    if (user.userLevel > 0) result.push('Почта');
    if (user.userLevel > 1) result.push('Самсаб');

    return result;
  }, [user]);

  const onBack = useCallback(() => {
    dispatch(setAdvertisementSellerInfo(null));
    history.push('/admin/users');
  }, []);

  const onChangePageActives = useCallback(() => {}, []);

  const onChangePageOtc = useCallback(() => {}, []);

  return (
    <View>
      <Box p="40px">
        <BackButton onClick={() => onBack()} />
        {user ? (
          <>
            <Box>
              <Box display="flex" alignItems="center" justifyContent="flex-end">
                <StyledButton onClick={() => onBan()}>
                  {user.isBanned ? 'Разбанить' : 'Забанить'}
                </StyledButton>
              </Box>
            </Box>

            <Box mt="20px">
              <Typography variant="h5">Информация</Typography>
            </Box>

            <Box display="flex" gap="20px" mt="20px">
              <Box flex="2">
                <FormLabel>Никнейм</FormLabel>

                <Box mt="10px" mb="20px">
                  <b>{user.name}</b>
                </Box>

                <FormLabel>Email</FormLabel>
                <Box mt="10px" mb="20px">
                  <b>{user.email}</b>
                </Box>
              </Box>

              <Box flex="2">
                <FormLabel>Баланс</FormLabel>
                <Box mt="10px" mb="20px">
                  <b>{user.wallet.amount} {user.wallet.currency}</b>
                </Box>

                <FormLabel>Успешные сделки</FormLabel>
                <Box mt="10px" mb="20px">
                  <b>
                    {formatTradesValues(
                      user.otc.countComplete,
                      user.otc.countTotal
                    )}
                  </b>
                </Box>

                <FormLabel>Среднее время сделки</FormLabel>
                <Box mt="10px" mb="20px">
                  <b>{formatAveragePaymentTime(user.otc.averagePaymentTime)}</b>
                </Box>
              </Box>

              <Box>
                <FormLabel>Аутентификация</FormLabel>
                {getUserAuth().map((auth: string) => (
                    <Box mt="10px" mb="20px">
                      <b>{auth}</b>
                    </Box>
                ))}
              </Box>
            </Box>
            <Box mt="40px">
              <FormLabel>Транзакции</FormLabel>
              <Box mt="10px" mb="20px">
                <TabsUnstyled
                  value={tab}
                  onChange={(
                    event: React.SyntheticEvent,
                    newValue: string | number
                  ) => setTab(Number(newValue))}
                >
                  <StyledTabsList>
                    <StyledTab>Активы</StyledTab>
                    <StyledTab>P2P</StyledTab>
                  </StyledTabsList>
                </TabsUnstyled>
              </Box>

              <TabPanel value={tab} index={0}>
                <PagingTable
                  items={[]}
                  heads={[
                    'Имя',
                    'Аунтефикация',
                    'Валюта',
                    'Сумма',
                    'Дата / Время',
                  ]}
                  loading={false}
                  onRow={() => <></>}
                  onHeadRowCell={(item) => (
                    <StyledTableHeadCell>{item}</StyledTableHeadCell>
                  )}
                  onChangePage={onChangePageActives}
                />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <PagingTable
                  items={advertisements}
                  heads={['Валюта', 'Цена', 'Доступный лимит', 'Матоды оплаты']}
                  loading={false}
                  onRow={(advertisement) => (
                    <StyledTableRow
                      onClick={() =>
                        history.push(
                          generatePath('/advertisement/:id', {
                            id: advertisement.id,
                          })
                        )
                      }
                    >
                      <StyledTableCell>
                        {advertisement.market.mainCurrencyId}
                      </StyledTableCell>
                      <StyledTableCell>{advertisement.factor}%</StyledTableCell>
                      <StyledTableCell>
                        {advertisement.volumeMax}
                      </StyledTableCell>
                      <StyledTableCell>
                        {advertisement.paymentMethods.length
                          ? advertisement.paymentMethods
                              .map((paymentMethod) => paymentMethod.name)
                              .join(', ')
                          : 'Любой'}
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                  onHeadRowCell={(item) => (
                    <StyledTableHeadCell>{item}</StyledTableHeadCell>
                  )}
                  onChangePage={onChangePageOtc}
                />
              </TabPanel>
            </Box>
          </>
        ) : (
          <Box
            p="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <CircularProgress />
          </Box>
        )}
      </Box>
    </View>
  );
};

const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  font-weight: bold;
  border-radius: 36px;
  text-transform: none;
  padding: 6px 25px;
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
  }
`;

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

const StyledTableHeadCell = styled(TableCell)`
  background-color: #ffffff;
  color: #999999;
`;

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const StyledTableCell = styled(TableCell)`
  cursor: pointer;
  font-size: 12px;
`;

export { User };
