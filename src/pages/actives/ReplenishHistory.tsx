import {
  Table,
  TableHead,
  TableBody,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import NoDataRow from "../../components/NoDataTableRow";
import PagingNavigation from "../../components/PagingNavigation";
import useAppSelector from "../../hooks/useAppSelector";
import {
  getMyTransactions,
  selectMyTransactions,
  Transaction,
  WalletType,
} from "../../store/walletSlice";
import * as uuid from 'uuid';
import { Box, TableCell, TableContainer, TableRow, Typography, useTheme } from "@mui/material";

type ReplenishHistoryProps = {
  selectedWallet: WalletType;
  tabIndex: number;
};

const replenishTableFields = [
  "Дата \\ Время",
  "TXID",
  "Количество",
  "Подтверждений",
  "Статус",
];

const ReplenishHistory = ({
  selectedWallet,
  tabIndex,
}: ReplenishHistoryProps) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [selectedPage, setSelectedPage] = useState(1);
  const perPage = 5;
  const direction = tabIndex === 0 ? "in" : "out";
  const replenishments = useAppSelector(selectMyTransactions);
  const [replenishmentsFiltered, setReplenishmentsFiltered] = useState<Transaction[]>([]);
  const loading = useAppSelector((state) => state.wallet.loading);

  useEffect(() => {
    dispatch(
      getMyTransactions({
        direction: direction,
        page: selectedPage,
        take: 20,
      })
    );
  }, [selectedWallet, tabIndex]);

  useEffect(() => {
    setReplenishmentsFiltered(
      replenishments.filter((el) => el.currencyId === selectedWallet.currency_id && el.direction === direction, this)
    );
  }, [replenishments]);

  const pagination =
    replenishmentsFiltered && replenishmentsFiltered.length > 1 ? (
      <PagingNavigation
        pagesCount={Math.ceil(replenishmentsFiltered.length / perPage)}
        selectedPage={selectedPage}
        onSelectPage={(_, page) => {
          setSelectedPage(page);
        }}
      />
    ) : (
      ""
    );

  const entryStatus = (status: string) => {
    const rejected = <span style={{ color: '#ff1616' }}> Отклонена </span>;
    const completed = <span style={{ color: '#cba977' }}> Завершена </span>;
    const onConfirmation = <span style={{ color: '#8F8982' }}> На подтверждении </span>;
    const confirmed = <span style={{ color: '#00BC40' }}> Подтверждена </span>;

    return (
      <span style={{ fontWeight: 'bold', lineHeight: '21px' }}>
        {(() => {
          switch (status) {
            case 'new': return onConfirmation;
            case 'confirm:wait': return onConfirmation;
            case 'confirm': return confirmed;
            case 'reject': return rejected;
            case 'error': return rejected;
            case 'complete': return completed
            default: return '-';
          }
        })()}
      </span>
    )

  }

  const formatEntrytxId = (entryTxId: string) => {
    const splitedEntryTxId = entryTxId.split(" ");
    const txId = splitedEntryTxId[splitedEntryTxId.length - 1]
    if (uuid.validate(txId)) {
      return txId
    }
    return entryTxId
  }

  return (
    <Box sx={{
      paddingTop: '24px',
      paddingBottom: '32px',
    }}>
      <Typography sx={{
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: '30px',
        marginBottom: {
          xs: '12px',
          sm: '19px',
        }
      }}>
        История {tabIndex === 0 ? "пополнений" : "выводов"}
      </Typography>
      <TableContainer sx={{ pb: '10px' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ fontSize: '12px' }}>
              {replenishTableFields.map((field) => (
                <TableCell key={field} sx={{
                  color: theme.palette.secondary.dark,
                  fontSize: '12px',
                  lineHeight: '100%',
                }}>
                  {field}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  {replenishTableFields.map((_, index) => (
                    <TableCell key={index}>
                      <Skeleton variant="rect" />
                    </TableCell>
                  ))}
                </TableRow>
              </>
            ) : (
              (replenishmentsFiltered &&
                replenishmentsFiltered.length > 0 &&
                replenishmentsFiltered.map((entry, index) => (
                  index < (selectedPage - 1) * perPage || index > selectedPage * perPage ? <></> :
                    <TableRow key={index}>
                      <TableCell>
                        {moment(entry.createdAt).format("D.M.YYYY HH:mm:ss")}
                      </TableCell>
                      <TableCell
                        sx={{
                          textOverflow: 'ellipsis',
                          tableLayout: 'fixed',
                          maxWidth: '150px',
                          whiteSpace: 'normal',
                          wordWrap: 'break-word'
                        }}
                      >
                        {formatEntrytxId(entry.txId)}
                      </TableCell>
                      <TableCell>
                        {entry.amount}
                      </TableCell>
                      <TableCell>
                        {" "}
                      </TableCell>
                      <TableCell>
                        {entryStatus(entry.status)}
                      </TableCell>
                    </TableRow>
                ))) || (
                <NoDataRow colSpan={replenishTableFields.length} text='Нет данных о пополнениях' />
              )
            )}
          </TableBody>
        </Table>
        {pagination}
      </TableContainer>
    </Box >
  );
};

export default ReplenishHistory;

