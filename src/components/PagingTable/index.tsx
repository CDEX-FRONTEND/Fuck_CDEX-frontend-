import React, { useMemo, useState } from 'react';
import {
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import NoDataRow from '../NoDataTableRow';

interface IPagingTableProps<T> {
  items: T[];
  itemsPerPage?: number;
  loading?: boolean;
  heads: string[];
  onHeadRowCell: (item: string) => JSX.Element;
  onRow: (item: T, index: number) => JSX.Element;
  onChangePage?: (page: number) => void;
  maxHeight?: string;
  total?: number;
}

const PagingTable = <T extends object>({
  items,
  itemsPerPage = 10,
  loading = true,
  heads,
  onHeadRowCell,
  onRow,
  onChangePage,
  maxHeight = '400px',
  total,
}: IPagingTableProps<T>) => {
  const [page, setPage] = useState<number>(1);

  const TOTAL = total ? total : items.length;

  const pageCount = useMemo(
    () => Math.ceil(TOTAL / itemsPerPage),
    [items, itemsPerPage]
  );

  return (
    <Box>
      <TableContainer
        style={{
          maxHeight,
        }}
      >
        <Table stickyHeader>
          <TableHead >
            <TableRow>{heads.map((item) => onHeadRowCell(item))}</TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={heads.length}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CircularProgress size="20px" />
                  </Box>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <NoDataRow
                colSpan={heads.length}
              />
            ) : (
              items.map((item, index) => onRow(item, index))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box my="20px">
        <Pagination
          count={pageCount}
          size="large"
          variant="outlined"
          color="primary"
          hidePrevButton
          hideNextButton
          onChange={(_, page) => {
            onChangePage && onChangePage(page);

            setPage(page);
          }}
        />
      </Box>
    </Box>
  );
};

export { PagingTable };
