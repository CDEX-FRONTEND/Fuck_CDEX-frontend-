import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Box, Typography } from '@mui/material';
import { OverlayPopup } from '../OverlayPopup';

interface SuccessPopupProps {
  onClose: () => void;
  message: string;
}

const SuccessPopup = ({ onClose, message }: SuccessPopupProps) => {
  return (
    <OverlayPopup onClose={onClose}>
      <Box
        display="flex"
        flex="1"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
        gap="10px"
      >
        <CheckCircleOutlineIcon
          style={{
            fontSize: '36px',
            color: '#009000',
          }}
        />
        <b>{message}</b>
      </Box>
    </OverlayPopup>
  );
};

export { SuccessPopup };
