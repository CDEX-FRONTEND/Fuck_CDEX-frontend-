import { Box } from '@mui/material';
import { FC } from 'react';
import currencyjs from 'currency.js'

interface CourseIndicatorProps {
  oldPrice: number;
  newPrice: number;
  currency: string;
}

const CourseIndicator: FC<CourseIndicatorProps> = ({
  oldPrice,
  newPrice,
  currency,
}) => {
  return (
    <Box display="inline-block" mx="10px">
      <Box display="flex" gap="10px" fontSize="18px">
        {oldPrice < newPrice ? (
          <>
            <span
                className="next__Price"
              style={{
                color: '#009900',
              }}
            >
              {currencyjs(newPrice, {
                separator: ' ',
                pattern: '#'
              }).format()}
            </span>
            <b
                className="next__Price"
              style={{
                color: '#009900',
              }}
            >
              {currency}
            </b>
            <span
                className="next__Price"
              style={{
                color: '#009900',
              }}
            >
              ▴
            </span>
          </>
        ) : oldPrice >= newPrice ? (
          <>
            <span
              style={{
                color: '#ff0000',
              }}
              className="next__Price"
            >
              {currencyjs(newPrice, {
                separator: ' ',
                pattern: '#'
              }).format()}
            </span>
            <b
              style={{
                color: '#ff0000',
              }}
              className="next__Price"
            >
              {currency}
            </b>
            <span
              style={{
                color: '#ff0000',
              }}
              className="next__Price"
            >
              ▾
            </span>
          </>
        ) : (
          <></>
        )}
      </Box>
    </Box>
  );
};

export { CourseIndicator };
