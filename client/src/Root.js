import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './Store';

//Middlewares
import api from './Middlewares/api';
import { createLogger } from 'redux-logger';
import refreshToken from './Middlewares/refreshToken';

export default (props) => {

  const logger = createLogger({
    colors: false
  });

  /**
   * Get the initial state from the local storage
   */
  const initialState = {
    auth: { 
      isAuthorized: !!localStorage.getItem('csrf-token'),
      csrfToken: localStorage.getItem('csrf-token')
    }
  };

  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(
      api,
      refreshToken,
      logger
    )
  );

  /**
   * Persist the login state on the local storage
   */
  window.onbeforeunload = () => {
    const { auth } = store.getState();
  
    if(auth.csrfToken){
      localStorage.setItem('csrf-token', auth.csrfToken);
    }
  };

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
};