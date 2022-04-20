
import { CircularProgress } from "@mui/material";
import React from "react";

type NoDataRowProps = {
  align?: 'center' | 'left' | 'right';
  circualSize?: number;
}

const NoData = ({ align = 'center', circualSize = 30 }: NoDataRowProps) => {

  return (
    <div style={{ textAlign: align, padding: '16px', fontWeight: 400, lineHeight: '30px' }} >
      <CircularProgress size={circualSize + "px"} />
    </div>

  )
}

export default NoData;

