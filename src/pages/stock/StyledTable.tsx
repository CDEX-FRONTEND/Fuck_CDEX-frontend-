import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { FC } from 'react';
import { styled } from '@mui/system';

type THead = {
  key: string;
  title: string;
};

interface StyledTableProps {
  heads: THead[];
  rows: any[];
}

const StyledTable: FC<StyledTableProps> = ({ heads, rows }) => {
  return (
    <TableContainer
      style={{
        maxHeight: '440px',
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            {heads &&
              heads.map((head) => (
                <StyledTableHeadCell>{head.title}</StyledTableHeadCell>
              ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow>
              {heads.map((head) => (
                <StyledTableCell>{row[head.key]}</StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const StyledTableHeadCell = styled(TableCell)`
  font-size: 12px;
  font-weight: 400;
  color: #8f8982;
  background-color: #ffffff;
  line-height: 1;
  padding: 4px;
  text-align: center;
  margin:10px 0;
`;

const StyledTableCell = styled(TableCell)`
  font-size: 11px;
  font-weight: 400;
  color: #000000;
  background-color: #ffffff;
  line-height: 1;
  padding: 10px 4px;
  text-align: center;
`;

export { StyledTable };
