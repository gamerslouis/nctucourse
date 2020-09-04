import React from 'react';
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { SnackbarProvider } from 'notistack';
import CssBaseLine from '@material-ui/core/CssBaseline'
import Reducers from './Redux/Reducers/index'
import Router from './Router'
import AuthenticationProvider from './Components/AuthenticationProvider'
import { isDev } from './Util/dev'

import Footer from './Components/footer'
import { Snackbar } from '@material-ui/core';

const theme = createMuiTheme({
  breakpoints: { // use bootstrap breakpoint value
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    }
  },
  typography: {
    "fontFamily": `'Noto Sans TC', sans-serif`,
  }
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(Reducers, composeEnhancers(applyMiddleware(thunk)))
// if (isDev) window.store = store;


function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <SnackbarProvider anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
          <AuthenticationProvider>
            <CssBaseLine>
              <Router />
              <Footer />
            </CssBaseLine>
          </AuthenticationProvider>
        </SnackbarProvider>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
