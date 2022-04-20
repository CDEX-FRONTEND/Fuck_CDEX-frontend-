import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import PopupProvider from './components/PopupProvider/PopupProvider';
import { defaultTheme } from './themes';
import { AuthProvider } from './components/AuthProvider/AuthProvider';
import GlobalStyles from '@mui/material/GlobalStyles';
import { ThemeProvider } from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';


ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <div role="alert">
            <pre>{error.message}</pre>
          </div>
        );
      }}
    >
      <Provider store={store}>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyles
            styles={{
              body: {
                backgroundColor: '#e6e6e6',
                fontFamily: 'Roboto',
                fontSize: '15px',
              },
              'html, body, #root': {
                height: '100%',
                padding: 0,
                margin: 0,
              },
              button: { // Сброс стилей для кнопок
                fontFamily: 'inherit',
                fontSize: '100%',
              }
            }}
          />
          <PopupProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </PopupProvider>
        </ThemeProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


