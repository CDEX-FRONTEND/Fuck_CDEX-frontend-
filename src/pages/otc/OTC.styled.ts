import { styled } from '@mui/material';
import { TabUnstyled, tabUnstyledClasses } from '@mui/base';

export const StyledTab = styled(TabUnstyled)`
  display: flex;
  align-items: center;
  background-color: rgba(245, 245, 245, 1);
  border-radius: 32px;
  border: 0;
  padding: 10px 18px;
  cursor: pointer;
  border: 2px solid transparent;
  &.${tabUnstyledClasses.selected} {
    color: ${(props) => props.theme.palette.primary.main};
    background-color: #ffffff;
    font-weight: 500;
    border-color: ${(props) => props.theme.palette.primary.main};
  }
`;
