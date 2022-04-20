import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TableCell,
  TableRow,
  Button,
  Box,
  styled,
  CircularProgress,
  useTheme,
} from '@mui/material';
import useAppSelector from '../../hooks/useAppSelector';
import {
  getMyAdvertisementList,
  cancelAdvertisement,
  selectAdvertisements,
  selectError,
  setError,
} from '../../store/otcSlice';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getMarketsOtc, selectMarkets } from '../../store/marketSlice';
import CreateAdvertisementPopup from '../create-advertisement';
import usePopup from '../../hooks/usePopup';
import { PagingTable } from '../../components/PagingTable';
import { SuccessPopup } from '../../components/SuccessPopup';
import { ErrorPopup } from '../../components/ErrorPopup';
import { AlertPopup } from '../../components/AlertPopup';
import { AppDispatch } from '../../store';

const MyAdvertisements = () => {
  /** флаг загрузки отц */
  const loading = useAppSelector((state) => state.otc.loading);

  /** текущая тема сайта */
  const theme = useTheme();

  /** управление всплывающими окнами */
  const { setPopup } = usePopup();

  /** диспетчер состояния */
  const dispatch: AppDispatch = useAppDispatch();

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState<number>(1);

  /** список магазинов */
  const markets = useAppSelector(selectMarkets);

  /** список объявлений */
  const advertisements = useAppSelector(selectAdvertisements);

  /** статусы для объявлений (фильтр) */
  const statuses = useMemo((): string[] => {
    return tab === 0 ? ['active'] : ['complete'];
  }, [tab]);

  /** ошибка */
  const error = useAppSelector(selectError);

  useEffect(() => {
    dispatch(
        getMyAdvertisementList({
          page,
          take: 20,
          filters: [{field: "status", operator: "in", value: ["active"]}],
        })
    );
    dispatch(getMarketsOtc());
  }, [page, tab]);

  useEffect(() => {
    if (error) {
      setPopup(
        <ErrorPopup
          onClose={() => {
            setPopup(null);
            dispatch(setError(null));
          }}
          errorMessage={error.message}
        />
      );
    }
  }, [error]);

  /**
   * @param {String} side тип объявления
   * @returns true если объявление о продаже крипты
   */
  const isAskSide = (side: string) => side === 'ask';

  /**
   * 
   */
  const onDeleteAdvertisement = useCallback(
    async (advertisementId: string) => {
      setPopup(
        <AlertPopup
          title="Подтверждение"
          closeable={true}
          onClose={() => setPopup(null)}
          positiveButton="Подтвердить"
          onPositiveButtonClick={async () => {
            const result = await dispatch(cancelAdvertisement(advertisementId));

            if (result && result.payload) {
              setPopup(
                <SuccessPopup
                  onClose={() => {
                    setPopup(null);
                  }}
                  message="Объявление удалено!"
                />
              );

              await dispatch(
                getMyAdvertisementList({
                  page,
                  take: 20,
                  filters: [{field: "status", operator: "in", value: ["active"]}],
                })
              );
            }
          }}
        >
          Подтвердите удаление объявления.
        </AlertPopup>
      );
    },
    [statuses]
  );

  return (
    <>
      {advertisements && markets && markets.length ? (
        <Box>
          <Box sx={{
            textAlign: {
              sm: 'left',
              lg: 'right'
            }
          }}>
            <StyledOutlinedButton
              onClick={() => setPopup(<CreateAdvertisementPopup />)}
              >
              Создать объявление
            </StyledOutlinedButton>
          </Box>
          <Box mt="20px">
            <PagingTable
              heads={[
                'Тип сделки',
                'Валюта',
                'Ставка',
                'Цена',
                'Метод оплаты',
                '',
              ]}
              items={advertisements}
              onChangePage={setPage}
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
              onRow={(advertisement, index) => (
                <StyledTableRow key={index}>
                  <StyledTableCell>
                    {`${isAskSide(advertisement.side) ? 'Продаю' : 'Покупаю'} ${markets
                      ? markets.find(
                        (market) => market.id === advertisement.marketId
                      )?.mainCurrencyId
                      : null
                      }`}
                  </StyledTableCell>
                  <StyledTableCell>
                    {markets
                      ? isAskSide(advertisement.side)
                        ? markets.find(
                          (market) => market.id === advertisement.marketId
                        )?.paidCurrencyId
                        : markets.find(
                          (market) => market.id === advertisement.marketId
                        )?.mainCurrencyId
                      : null}
                  </StyledTableCell>
                  <StyledTableCell>
                    {isAskSide(advertisement.side)
                      ? `${(advertisement.factor * 100).toFixed(
                        1
                      )}% (доплата вам)`
                      : `${(advertisement.factor * 100).toFixed(
                        1
                      )}% (вы доплачиваете)`}
                  </StyledTableCell>
                  <StyledTableCell>
                    {`${advertisement.volume} — ${advertisement.volumeMax} ${markets
                      ? markets.find(
                        (market) => market.id === advertisement.marketId
                      )?.mainCurrencyId
                      : null
                      }`}
                  </StyledTableCell>
                  <StyledTableCell>
                    {advertisement.paymentMethods
                      .map((paymentMethod) => paymentMethod.name)
                      .join(', ')}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <StyledButton
                      onClick={() => onDeleteAdvertisement(advertisement.id)}
                      variant="outlined"
                    >
                      Удалить
                    </StyledButton>
                  </StyledTableCell>
                </StyledTableRow>
              )}
              loading={loading}
            />
          </Box>
        </Box>
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
    </>
  );
};

const StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.02);
  }
`;
const StyledTableCell = styled(TableCell)`
`;

const StyledOutlinedButton = styled(Button)`
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: 600;
  border-radius: 36px;
  padding: 16px 24px;
  font-size: 16px;
  text-transform: unset;
  border: 2px solid ${(props) => props.theme.palette.primary.main};
`;

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

export default MyAdvertisements;
