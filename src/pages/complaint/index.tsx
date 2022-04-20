import React, { useCallback, useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import {
  getReasons,
  selectReasons,
  fileComplaint,
} from '../../store/complaintSlice';
import { selectAdvertisementSellerInfo } from '../../store/otcSlice';
import usePopup from '../../hooks/usePopup';
import { Redirect } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import { SuccessPopup } from '../../components/SuccessPopup';
import { AppDispatch } from '../../store';
import { StyledMainButton } from '../../components/Popup/Popup.styled';

const FormComplaint = () => {
  const { authenticated } = useAuth();
  const dispatch: AppDispatch = useAppDispatch();
  const reasons = useAppSelector(selectReasons);
  const { setPopup } = usePopup();
  const [reasonId, setReasonId] = useState<string>('');
  const [description, setDescription] = useState<string>();
  const seller = useAppSelector(selectAdvertisementSellerInfo);

  useEffect(() => {
    dispatch(getReasons());
    if (reasons && reasons.length) {
      setReasonId(reasons[0].id);
    }
  }, []);

  const onChangeReason = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReasonId(event.target.value);
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const addComplaint = useCallback(async () => {
    if (seller && seller.userId && reasonId && description) {
      const requestValues = {
        complaintUserId: seller.userId,
        complaintReasonId: reasonId,
        description,
        outId: '00000000-0000-0000-0000-000000000000',
        module: 'otc',
      };

      await dispatch(fileComplaint(requestValues));

      setPopup(
        <SuccessPopup
          onClose={() => setPopup(null)}
          message="Жалоба оставлена!"
        />
      );
    }
  }, [seller, reasonId, description]);

  if (!authenticated) {
    return <Redirect to="/login" />;
  }

  return (
    reasons ? (
      <Box
        sx={{
          marginTop: {
            xs: '24px',
            md: '40px',
          }
        }}
      >
        <FormLabel sx={{ color: '#8A8A8A', fontSize: '14px' }}>Суть проблемы: </FormLabel>

        <FormControl fullWidth sx={{ marginTop: '15px' }}>
          <RadioGroup value={reasonId} onChange={onChangeReason}>
            {reasons.map((reason, index) => (
              <FormControlLabel
                key={index}
                value={reason.id}
                control={<Radio />}
                label={reason.name}
                sx={{
                  color: '#000000',
                  ...(reasonId === reason.id ? {
                    fontWeight: 500,
                  } : {
                    opacity: 0.5,
                    fontWeight: 400,
                  })
                }}
                disableTypography
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Box
          sx={{
            marginTop: {
              xs: '24px',
              md: '40px',
            }
          }}
        >
          <FormLabel sx={{ fontSize: '14px' }}>
            Комментарий:
            <TextField
              fullWidth
              placeholder="Опишите суть жалобы"
              type="text"
              value={description}
              onChange={onChangeDescription}
              variant="standard"
              multiline
              inputProps={{ maxLength: 100, style: { fontSize: '14px' } }}
              sx={{ marginTop: '10px' }}
            />
          </FormLabel>
        </Box>

        <StyledMainButton
          disabled={!description}
          onClick={addComplaint}
          sx={{
            marginTop: {
              xs: '24px',
              md: '40px',
            }
          }}
        >
          Подать жалобу
        </StyledMainButton>
      </Box>
    ) : (
      <Box
        display="flex"
        flex="1"
        alignItems="center"
        justifyContent="center">
          <CircularProgress />
      </Box>
    )
  );
};

export default FormComplaint;
