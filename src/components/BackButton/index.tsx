import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';
import { FC } from 'react';
import BackArrowIcon from '../../icons/GoldenBackArrowIcon.svg';

interface BackButtonProps {
  onClick: () => void;
  text?: string
}

const BackButton: FC<BackButtonProps> = ({ onClick, text = 'вернуться назад' }) => {
  return (
    <StyledButton onClick={onClick}>
      <img src={BackArrowIcon} alt="back" />
      <Box ml="15px">{text}</Box>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  text-transform: none;
  font-size: 16px;
  color: #717779;
`;

export default BackButton;
