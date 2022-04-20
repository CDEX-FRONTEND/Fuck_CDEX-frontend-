import { styled, TableCell, TableRow } from "@mui/material";


export const StyledTableCell = styled(TableCell)`
  text-overflow: ellipsis;
  table-layout: fixed;
  max-width: 150px;
  white-space: normal;
  word-wrap: break-word;
  font-size: 14px;
  cursor: pointer;
`,

 StyledTableHeadCell = styled(TableCell)`
  background-color: #ffffff;
  color: #132026ж
  font-size: 12px;
`,

 StyledTableRow = styled(TableRow)`
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;


