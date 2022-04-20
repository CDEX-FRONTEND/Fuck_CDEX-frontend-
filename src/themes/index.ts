import { createTheme } from "@mui/material";

const defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#CBA977',
      dark: '#BC965E' // primaryColorActive
    },
    secondary: {
      light: '#f5f5f5', //lightGray
      main: '#BEBEBE', //gray,
      dark: '#8F8982' // darkGray
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 320,
      md: 768,
      lg: 1240,
      xl: 1240,
    }
  }
});

export {
  defaultTheme
}
