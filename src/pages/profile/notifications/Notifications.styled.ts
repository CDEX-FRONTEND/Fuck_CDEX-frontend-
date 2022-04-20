import { Box, styled } from "@mui/material";

export const SwitchersContainer = styled(Box)((props) => ({
  display: 'flex',
  gap: '70px',

  [props.theme.breakpoints.down("md")]: {
    flexDirection: 'column',
    gap: '16px',
  }
})),

  SwitcherItem = styled(Box)((props) => ({
    display: 'flex',

    [props.theme.breakpoints.down("md")]: {
      justifyContent: 'space-between',
    }
  })),

  SwitcherItemTitle = styled(Box)(({ theme }) => ({
    marginRight: '20px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#717779'
  })),

  NotificationItem = styled(Box)((props) => ({
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
      alignItems: 'normal',
      justifyContent: 'normal',
      padding: '24px 0px 18px 0px',
      '&:first-of-type': {
        paddingTop: '2px',
      },
    }
  }));