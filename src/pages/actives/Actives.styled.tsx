import {
  styled
} from '@mui/material';
import {
  TabsListUnstyled,
  TabUnstyled,
  tabUnstyledClasses,
} from '@mui/base';

export const StyledTab = styled(TabUnstyled)`
  background-color: #f5f5f5;
  color: #000000;
  border: 2px solid transparent;
  padding: 8px 18px;
  cursor: pointer;
  border-radius: 36px;
  font-size: 14px;
  line-height: 21px;
  font-weight: 500;
  &.${tabUnstyledClasses.selected} {
    background-color: #ffffff;
    border-color: #cba977;
    color: #cba977;
  }
`;

export const StyledTabsList = styled(TabsListUnstyled)`
  display: flex;
  gap: 16px;
`;