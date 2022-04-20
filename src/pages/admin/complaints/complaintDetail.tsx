import { useEffect, useMemo } from 'react';
import { Box, styled, CircularProgress } from '@mui/material';
import { useHistory, useParams } from 'react-router-dom';
import BackButton from '../../../components/BackButton';
import useAppDispatch from '../../../hooks/useAppDispatch';
import useAppSelector from '../../../hooks/useAppSelector';
import { AppDispatch, RootState } from '../../../store';
import moment from 'moment';
import { getComplaint } from '../../../store/complaintSlice';

const ComplaintDetail = () => {
  const { id } = useParams<{
    id: string;
  }>();
  const complaint = useAppSelector((state) => state.complaint.complaintInfo);
  const dispatch: AppDispatch = useAppDispatch();

  const history = useHistory();

  useEffect(() => {
    dispatch(getComplaint(id));
  }, []);

  return !complaint ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top="0"
      right="0"
      bottom="0"
      left="0"
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box m="30px" height="100%">
      <Box mb="20px">
        <BackButton onClick={() => history.push('/admin/complaints')} />
      </Box>
      <Box fontSize="18px" fontWeight="bold" mb="20px">
        Информация
      </Box>
      <Box display="flex">
        <Box display="flex" flex="1" flexDirection="column" my="10px">
          <StyledLabel>Никнейм:</StyledLabel>
          <Box>{complaint.complaintUserName}</Box>
        </Box>
        <Box display="flex" flex="2" flexDirection="column" my="10px">
          <StyledLabel>Причина:</StyledLabel>
          <Box>{complaint.complaintReasonName}</Box>
        </Box>
        <Box display="flex" flex="3" flexDirection="column" my="10px">
          <StyledLabel>Дата и время обращения:</StyledLabel>
          <Box>
            {moment(new Date(complaint.createdAt)).format(
              'DD.MM.YYYY / HH:mm'
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex">
        <Box display="flex" flex="1" flexDirection="column" my="10px">
          <StyledLabel>От кого поступила:</StyledLabel>
          <Box>{complaint.userName}</Box>
        </Box>
      </Box>
      <Box display="flex">
        <Box display="flex" flex="1" flexDirection="column" my="10px">
          <StyledLabel>Комментарий:</StyledLabel>
          <Box>{complaint.description}</Box>
        </Box>
      </Box>
    </Box>
  );
};

const StyledLabel = styled(Box)`
  flex: 1;
  font-size: 16px;
  color: #999999;
  margin-bottom: 20px;
`;

export { ComplaintDetail };
