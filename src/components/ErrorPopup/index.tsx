import { Box, Typography } from '@mui/material';
import { OverlayPopup } from '../OverlayPopup';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface ErrorPopupProps {
  onClose: () => void;
  errorMessage: string;
}

const ErrorPopup = ({ onClose, errorMessage }: ErrorPopupProps) => {
  return (
    <OverlayPopup
      onClose={onClose}
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        flexDirection="column"
        flex="1"
        gap="10px"
      >
        <ErrorOutlineIcon
          style={{
            fontSize: '36px',
            color: '#ff0000',
          }}
        />
        <b>{errorMessage}</b>
      </Box>
    </OverlayPopup>
  );
};

export { ErrorPopup };
