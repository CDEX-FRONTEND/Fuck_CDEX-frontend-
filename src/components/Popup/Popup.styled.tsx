import { styled } from '@mui/material';
import {
  ButtonUnstyled
} from '@mui/base';

export const StyledMainButton = styled(ButtonUnstyled)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: #ffffff;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  border-radius: 36px;
  width: 100%;
  border: 0;
  padding: 15px 0;
  &:hover {
    background-color: ${(props) => props.theme.palette.primary.main};
  }
`;

export const StyledOutlinedButton = styled(ButtonUnstyled)`
  background-color: #ffffff;
  cursor: pointer;
  color: ${(props) => props.theme.palette.primary.main};
  font-weight: 600;
  border-radius: 100px;
  padding: 12px 0;
  width: 100%;
  text-transform: none;
  border: 2px solid ${(props) => props.theme.palette.primary.main};
`;