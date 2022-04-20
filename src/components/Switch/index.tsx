import React from 'react';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Switch, { SwitchProps, SwitchClassKey } from '@material-ui/core/Switch';
import styles from './style.module.scss';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}

const StyledSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 40,
      height: 24,
      padding: 0,
    },
    switchBase: {
      padding: 4,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#CBA977',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 16,
      height: 16,
    },
    track: {
      borderRadius: 40 / 2,
      backgroundColor: '#DADADB',
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  })
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

type SwitcherProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
};

export default function Switcher({
  checked,
  onChange,
  loading,
}: SwitcherProps) {
  return (
    <div className={styles.wrapper}>
      <StyledSwitch onChange={onChange} checked={checked} />
    </div>
  );
}
