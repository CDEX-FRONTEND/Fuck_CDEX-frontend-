
import { Button, styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useEffect } from 'react';
import { generatePath, useHistory } from 'react-router';
import NoDataRow from '../../components/NoDataTableRow';
import SkeletonGenerator from '../../components/SkeletonGenerator';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { getMarketsOtc, selectMarkets } from '../../store/marketSlice';
import { getAdvertisementList, selectAdvertisements } from '../../store/otcSlice';
import { UserType } from '../../store/userSlice';


interface TableSellerInfoProps {
  tableName: string,
  userId: string,
  currentUser: UserType | null
}

const TableSellerInfo = ({ tableName, userId, currentUser }: TableSellerInfoProps) => {

  const dispatch = useAppDispatch();
  const history = useHistory();
  const loading = useAppSelector((state) => state.otc.loading);
  const advertisements = useAppSelector(selectAdvertisements);
  const markets = useAppSelector(selectMarkets);
  const tableHeaders = ['Валюта', 'Цена', 'Доступный лимит', 'Метод оплаты', '']
  const isAskSide = (side: string) => side === 'ask';

  useEffect(() => {
    dispatch(getAdvertisementList({ userId }));
    dispatch(getMarketsOtc());
  }, []);

  const filteredAdvertisements = advertisements.filter(a => a.side === tableName);
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {
              tableHeaders.map((h, idx) =>
                <TableCell sx={{
                  fontSize: '12px',
                  lineHeight: '100%',
                  color: '#8F8982',
                }}>
                  {h}
                </TableCell>
              )
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <SkeletonGenerator rowsCount={1} cellCount={5} />
          ) : filteredAdvertisements?.length > 0 ? (
            filteredAdvertisements.map((advertisement) => {
              return (
                <TableRow key={advertisement.id}>
                  <TableCell
                    component="th"
                    scope="row"
                    width={96}
                  >
                    {markets
                      ? isAskSide(advertisement.side)
                        ? markets.find(
                          (market) => market.id === advertisement.marketId
                        )?.paidCurrencyId
                        : markets.find(
                          (market) => market.id === advertisement.marketId
                        )?.mainCurrencyId
                      : null}
                  </TableCell>

                  <TableCell
                    component="th"
                    scope="row"
                    width={295}
                  >
                    {isAskSide(advertisement.side)
                      ? `${advertisement.factor * 100}% (доплата вам)`
                      : `${advertisement.factor * 100}% (вы доплачиваете)`}
                  </TableCell>

                  <TableCell width={295}>
                    {advertisement.volumeMax}
                  </TableCell>

                  <TableCell
                    component="th"
                    scope="row"
                    width={330}
                  >
                    {advertisement?.paymentMethods?.length > 0 ? advertisement.paymentMethods
                      .map((paymentMethod) => paymentMethod.name)
                      .join(', ') : 'Любой'}
                  </TableCell>

                  <TableCell align='right' width={100}>
                    <StyledButton
                      onClick={() =>
                        history.push(
                          generatePath('/advertisement/:id', {
                            id: advertisement.id,
                          })
                        )
                      }
                      disabled={
                        currentUser?.id === advertisement.user.userId
                      }
                      variant="outlined"
                    >
                      {advertisement.side === 'ask' ? 'Продать' : 'Купить'}
                    </StyledButton>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <NoDataRow colSpan={tableHeaders.length} />
          )}
        </TableBody>
      </Table>
    </TableContainer >
  );
};


const StyledButton = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  border-radius: 32px;
  padding: 2px 12px;
  height: 32px;
  text-transform: none;
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
  }
  &:disabled {
    background-color: rgba(245, 245, 245, 1);
    color: #000000;
  }
  `;

export default TableSellerInfo;