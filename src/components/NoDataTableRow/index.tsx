import { TableCell, TableRow } from '@mui/material';
import React from 'react';

type NoDataRowProps = {
  colSpan: number;
  align?: 'center' | 'left' | 'right';
  text?: string;
};

const NoDataRow = ({
  colSpan,
  align = 'center',
  text = 'Нет данных для отображения',
}: NoDataRowProps) => {

  return (
    <TableRow key={'default_row'}>
      <TableCell colSpan={colSpan} align={align} sx = {{
          color:'#8F8982 !important' ,
          fontSize: '14px !important',
          lineHeight: '21px !important',
          marginTop: '16px !important',
      }}
       >
        {text}
      </TableCell>
    </TableRow>
  );
};

export default NoDataRow;
