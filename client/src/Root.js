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

  const store = createStore(
    reducers,
    applyMiddleware(
      api,
      refreshToken,
      logger
    )
  );

  return (
    <Provider store={store}>
      {props.children}
    </Provider>
  )
}