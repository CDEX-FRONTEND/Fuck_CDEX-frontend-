import { TableCell, TableRow } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';

const SkeletonGenerator = (props: any) => {
  const { rowsCount = 1, cellCount } = props;
  return (
    <>
      {Array.from(Array(rowsCount).keys()).map((_, i) => (
        <TableRow key={i}>
          {Array.from(Array(cellCount).keys()).map((cell, index) => (
            <TableCell key={index} component="th" scope="row">
              <Skeleton width="200px" height="20px" variant="rect" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default SkeletonGenerator;
