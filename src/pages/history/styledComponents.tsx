import { styled } from '@mui/material';
import { TableCell } from '@material-ui/core';

export const StyledTableHeadCell = styled(TableCell)`
  padding: 0 19px 19px 0;
  font-style: normal;
  align-items: center;
  color: #838383 !important;
  border-bottom: 1px solid rgba(39, 42, 47, 0.1) !important;
  white-space: nowrap;
`;

export const StyledTableBodyCell = styled(TableCell)`
  padding: 15px 19px 15px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  align-items: center;
  color: #000000;
  border-bottom: 1px solid rgba(39, 42, 47, 0.1) !important;
  white-space: nowrap;

  h3, h4 {
    font-weight: normal;
    margin-top: 0;
  }

  h3 {
    margin-bottom: 15px;
  }

  h4 {
    margin-bottom: 10px;
  }
`;