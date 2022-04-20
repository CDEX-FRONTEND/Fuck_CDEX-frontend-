import React, { useEffect } from 'react';
import copyToClipboard from '../../../helpers/copyToClipboard';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import {
  getReferalProgramLink,
  selectReferalProgramLink,
} from '../../../store/referralProgramSlice';
import { selectUser } from '../../../store/userSlice';
import TextFieldForCopy from '../../../components/TextFieldForCopy';
import { Box, useTheme } from '@mui/material';

const PartnerLink = () => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const user = useAppSelector(selectUser);
  const referalProgramLink = useAppSelector(
    (state) => state.referralProgram.referralProgramLink
  );

  useEffect(() => {
    dispatch(getReferalProgramLink('invite'));
  }, [user]);

  const url =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port === '' ? '' : ':' + window.location.port);

  return (
    <div style={{ paddingBottom: '10px' }}>
      <div style={{ marginTop: '24px' }}>
        <Box
          sx={{
            color: theme.palette.secondary.dark,
            fontSize: '14px',
            lineHeight: '21px',
            paddingBottom: '12px',
          }}
        >
          {' '}
          Ваша ссылка
        </Box>
        {referalProgramLink ? (
          <TextFieldForCopy
            value={`${url}/login/register?referral=${referalProgramLink.code}`}
            onClick={() =>
              copyToClipboard(
                `${url}/login/register?referral=${referalProgramLink.code}`
              )
            }
          />
        ) : (
          <Box>Ваша реферальная ссылка отсутствует</Box>
        )}
      </div>
      <div
        style={{
          marginTop: '36px',
          fontSize: '14px',
          lineHeight: '21px',
        }}
      >
        <p>
          Пригласи пользователей по реферальной ссылке на биржу GoldenBit и
          <span
            style={{
              backgroundColor: '#fff8f2',
              padding: '4px 8px',
              borderRadius: '12px',
            }}
          >
            зарабатывай до 20% с их обменов!
          </span>
        </p>
        <p>
          Программа распространяется только на сделки между криптовалютой и
          фиатными средствами (в обе стороны)
        </p>
      </div>
    </div>
  );
};

export default PartnerLink;
