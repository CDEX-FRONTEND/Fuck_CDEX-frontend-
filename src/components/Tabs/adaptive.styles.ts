import { makeStyles } from "@material-ui/core";


const key = 'sm';

export const useAdaptiveStyles = makeStyles((theme) => ({

  Tabs: {
    display: 'flex',
    alignItems: 'center',
    gridColumnGap: '25px',
    flexWrap: 'wrap',
    gridRowGap: '10px',

    [theme.breakpoints.down(key)]: {
      overflow: 'auto',
      flexWrap: 'nowrap',
    }
  },
}));




