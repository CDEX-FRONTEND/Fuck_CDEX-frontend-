import {
  Box,
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

const BidStyledTable: FC<StyledTableProps> = ({ heads, rows }) => {
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
            <TableRow
              style={{
                position: 'relative',
              }}
            >
              {heads.map((head) => (
                <StyledTableCell>{row[head.key]}</StyledTableCell>
              ))}
              <ProgressBar width={`${row.__progress}%`} />
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
`;

const StyledTableCell = styled(TableCell)`
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  background-color: #ffffff;
  line-height: 1;
`;

const ProgressBar = styled(Box)`
  position: absolute;
  height: 100%;
  background: linear-gradient(270deg, #D6F9D3 0%, rgba(214, 249, 211, 0) 100%);
  opacity: 0.7;
  border:0 solid;
  border-radius: 0 10px 10px 0;
  left: 0;
  z-index: 1;
`;

export { BidStyledTable };
