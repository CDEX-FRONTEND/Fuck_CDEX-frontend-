import { Box } from '@mui/material';
import { OverlayPopup } from '../OverlayPopup';
import { StyledMainButton, StyledOutlinedButton } from '../Popup/Popup.styled';

interface AlertPopupProps {
  positiveButton?: string;
  onPositiveButtonClick?: () => void;
  negativeButton?: string;
  onNegativeButtonClick?: () => void;
  onClose?: () => void;
  closeable?: boolean;
  children?: React.ReactChild;
  title?: string;
}

const AlertPopup = ({
  children,
  positiveButton,
  negativeButton,
  onPositiveButtonClick,
  onNegativeButtonClick,
  onClose,
  closeable = false,
  title,
}: AlertPopupProps) => {
  return (
    <OverlayPopup
      closeable={closeable}
      title={title}
      onClose={() => closeable && onClose && onClose()}
    >
      {children && (
        <Box m="40px 0">
          {children}
        </Box>
      )}
      <Box
        display="flex"
        mt="auto"
        gap="16px"
      >
          {positiveButton && (
            <StyledMainButton
              onClick={() => onPositiveButtonClick && onPositiveButtonClick()}
            >
              {positiveButton}
            </StyledMainButton>
          )}
          {negativeButton && (
            <StyledOutlinedButton
              onClick={() => onNegativeButtonClick && onNegativeButtonClick()}
              variant="outlined"
            >
              Отменить
            </StyledOutlinedButton>
          )}
        </Box>
    </OverlayPopup>
  );
};

export { AlertPopup };
