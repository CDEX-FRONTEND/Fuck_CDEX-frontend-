import { Box, styled } from "@mui/material";
import {
  ButtonUnstyled
} from '@mui/base';

export const StyledBorderedButton = styled(ButtonUnstyled)(({ theme }) => ({
  backgroundColor: '#ffffff',
  color: theme.palette.primary.main,
  border: `2px solid ${theme.palette.primary.main}`,
  lineHeight: '30px',
  fontSize: '16px',
  borderRadius: '36px',
  padding: '0 18px',
  minWidth: '135px',
  cursor: 'pointer',
})),

  ProfileItem = styled(Box)((props) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 0px',
    borderBottom: '1px solid #D9D9D9',
    '&:last-of-type': {
      borderBottom: 'none',
    },

    [props.theme.breakpoints.down("md")]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'normal',
      padding: '0px 0px 24px 0px',
      marginBottom: '24px',
      '&:last-of-type': {
        marginBottom: '0px',
      },
    },
  })),

  ProfileItemInfo = styled(Box)((props) => ({
    marginRight: 'auto',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '485px',
  })),

  ProfileItemTitle = styled(Box)((props) => ({
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',

    [props.theme.breakpoints.down("md")]: {
      paddingTop: '12px'
    }
  })),

  ProfileItemDescription = styled(Box)((props) => ({
    fontSize: '14px',
    lineHeight: '21px',
    marginTop: '10px',
    color: '#838383',
    [props.theme.breakpoints.down("md")]: {
      paddingBottom: '24px'
    }
  })),

  PopupInfo = styled(Box)((props) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '70px 40px 40px 40px',
    maxWidth: '500px',

    fontSize: '25px',
    lineHeight: '42px'
  }));