import {
  TableHead,
  TableCell,
  TableRow,
  Box,
  Button,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import useAppSelector from '../../hooks/useAppSelector';
import { getMyFavoriteList, selectFavoriteList } from '../../store/otcSlice';
import { removeFavoriteUser } from '../../store/userSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import { generatePath, useHistory } from 'react-router';
import { PagingTable } from '../../components/PagingTable';
import usePopup from '../../hooks/usePopup';
import { AlertPopup } from '../../components/AlertPopup';
import { SuccessPopup } from '../../components/SuccessPopup';

const Favorites = () => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.otc.loading);
  const history = useHistory();
  const theme = useTheme();
  const favorites = useAppSelector(selectFavoriteList);
  const ITEMS_PER_PAGE = 10;
  const { setPopup } = usePopup();
  useEffect(() => {
    dispatch(
      getMyFavoriteList({
        page: 1,
        take: 10,
      })
    );
  }, []);

  const remove = useCallback((id: string) => {
    setPopup(
      <AlertPopup
        title="Подтверждение"
        closeable={true}
        onClose={() => setPopup(null)}
        positiveButton="Удалить"
        onPositiveButtonClick={async () => {
          console.log(`delete favorite`);
          await dispatch(removeFavoriteUser(id));
          console.log(`fetch favorites`);
          await dispatch(
            getMyFavoriteList({
              page: 1,
              take: 10,
            })
          );

          setPopup(
            <SuccessPopup
              onClose={() => setPopup(null)}
              message="Пользователь успешно удалён!"
            />
          );
        }}
      >
        Вы уверены что хотите удалить этого пользователя?
      </AlertPopup>
    );
  }, []);

  const heads = useMemo(
    () => [
      'Продавец',
      'Успешные сделки',
      'Среднее время перевода',
      'Ваши сделки',
      '',
    ],
    []
  );

  return (
    <>
      <PagingTable
        items={favorites}
        heads={heads}
        itemsPerPage={ITEMS_PER_PAGE}
        onHeadRowCell={(head) =>
          <TableCell
            sx={{
              color: theme.palette.secondary.dark,
              fontSize: '12px',
              lineHeight: '100%',
            }}
          >
            {head}
          </TableCell>
        }
        onRow={(item) => (
          <TableRow>
            <TableCell>
              <b
                onClick={() =>
                  history.push(
                    generatePath('/advertisement/seller-profile/:id', {
                      id: item.userId,
                    })
                  )
                }
              >
                {item.name}
              </b>
            </TableCell>
            <TableCell scope="row">
              {item.countComplete + '/' + item.countTotal}
            </TableCell>
            <TableCell scope="row">
              {item.averagePaymentTime || '-'}
            </TableCell>
            <TableCell scope="row">
              {item.countWithMe || 'Не было сделок'}
            </TableCell>
            <TableCell scope="row" align="right">
              <StyledButton onClick={() => remove(item.userId)}>
                Удалить
              </StyledButton>
            </TableCell>
          </TableRow>
        )}
        loading={loading}
        onChangePage={(page: number) => { }}
      />
    </>
  );
};

const StyledButton = styled(Button)`
  background-color: #f5f5f5;
  color: #000000;
  font-weight: bold;
  font-weight: 500;
  font-size: 14px;
  line-height: 28px;
  border: 0;
  border-radius: 36px;
  text-transform: none;
  padding: 6px 25px;
  &:hover {
    border: 0;
  }
`;

export default Favorites;
