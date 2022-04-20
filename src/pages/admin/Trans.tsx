import BackButton from '../../components/BackButton';
import {
  confirmTransaction,
  getTransaction,
  rejectTransaction,
  setLastError,
} from '../../store/walletSlice';
import { useDispatch } from 'react-redux';
import useAppSelector from '../../hooks/useAppSelector';
import { useEffect, useMemo, useState } from 'react';
import { Box, Button, CircularProgress, Snackbar, TextField } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import { Alert, styled } from '@mui/material';
import { AppDispatch } from '../../store';
import moment from 'moment';

const Trans = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const transaction = useAppSelector((state) => state.wallet.transaction);
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const [status, setStatus] = useState<'wait' | 'confirm' | 'reject'>('wait');
  const error = useAppSelector((state) => state.wallet.lastError);

  useEffect(() => {
    setTimeout(() => {
      dispatch(getTransaction(id));
    }, 1000);
  }, []);

  useEffect(() => {
    if (transaction) {
      if (['error', 'reject'].includes(transaction.status)) {
        setStatus('reject');
      } else if (['complete', 'confirm'].includes(transaction.status)) {
        setStatus('confirm');
      }
    }
  }, [transaction]);

  const uncompleted = useMemo(
    () =>
      transaction &&
      !['error', 'complete', 'reject', 'confirm', 'new'].includes(
        transaction.status
      ),
    [transaction, status]
  );

  return !transaction ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box p="40px">
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={error !== null}
        key={error}
      >
        <Alert
          onClose={() => {
            dispatch(setLastError(null));
          }}
          severity="error"
        >
          {error}
        </Alert>
      </Snackbar>
      <Box>
        <Box mb="20px">
          <BackButton onClick={() => history.push('/admin/transactions')} />
        </Box>
        <Box display="flex" justifyContent="flex-end">
          {uncompleted ? (
            <Box display="flex" gap="10px">
              <Button
                onClick={async () => {
                  const { payload } = await dispatch(rejectTransaction(id));
                  if (payload) {
                    setStatus('reject');
                  }
                }}
                variant="outlined"
                disabled={status !== 'wait'}
              >
                Отклонить
              </Button>
              <Button
                onClick={async () => {
                  const { payload } = await dispatch(confirmTransaction(id));
                  if (payload) {
                    setStatus('confirm');
                  }
                }}
                variant="outlined"
                disabled={status !== 'wait'}
              >
                Подтвердить
              </Button>
            </Box>
          ) : (
            <Box></Box>
          )}
        </Box>
      </Box>

      {status !== 'wait' && (
        <Box my="20px">
          <Alert severity={status === 'reject' ? 'error' : 'success'}>
            {status === 'reject'
              ? 'Транзакция была отклонена'
              : status === 'confirm'
              ? 'Транзакция была подтверждена'
              : ''}
          </Alert>
        </Box>
      )}

      <Box fontSize="18px" fontWeight="bold" mb="20px">
        Информация
      </Box>

      <Box display="flex">
        <Box flex="1">
          <Box display="flex" my="10px">
            <StyledLabel>Тип операции:</StyledLabel>
            <Box flex="1">
              {transaction.direction === 'in' ? 'Ввод' : 'Вывод'}
            </Box>
          </Box>
          <Box display="flex" my="10px">
            <StyledLabel>Дата / Время:</StyledLabel>
            <Box flex="1">
              {moment(transaction.createdAt).format('D.M.YYYY HH:mm:ss')}
            </Box>
          </Box>
          <Box display="flex" my="10px">
            <StyledLabel>Пользователь:</StyledLabel>
            <Box flex="1">
              {transaction.userName && transaction.userName.length
                ? transaction.userName
                : 'не указан'}
            </Box>
          </Box>
        </Box>

        <Box flex="1">
          <Box display="flex" my="10px">
            <StyledLabel>Валюта:</StyledLabel>
            <Box flex="1">{transaction.currencyId}</Box>
          </Box>
          <Box display="flex" my="10px">
            <StyledLabel>
              {`Сумма ${transaction.direction === 'in' ? 'ввода' : 'вывода'}:`}
            </StyledLabel>
            <Box flex="1">{transaction.amount}</Box>
          </Box>
          <Box display="flex" my="10px">
            <StyledLabel>Комиссия:</StyledLabel>
            <Box flex="1">
              {transaction.feeService ? transaction.feeService : 'нет'}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box display="flex">
        <Box flex="1">
          <Box display="flex" my="10px">
            <Box fontSize="16px" color="#999999" flex="1">
              Сеть:
            </Box>
            <Box flex="1">{transaction.currencyId}</Box>
          </Box>
          <Box display="flex" my="10px" lineHeight="56px">
            <Box fontSize="16px" color="#999999" flex="1">
              {`Адрес ${transaction.direction === 'in' ? 'ввода' : 'вывода'}:`}
            </Box>
            <Box flex="1">
              <TextField variant='outlined' value={transaction.addressTo} disabled />
            </Box>
          </Box>
        </Box>
        <Box flex="1"></Box>
      </Box>
    </Box>
  );
};

const StyledLabel = styled(Box)`
  flex: 1;
  font-size: 16px;
  color: #999999;
`;

export { Trans };
