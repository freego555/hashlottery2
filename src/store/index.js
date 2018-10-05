import { createStore, applyMiddleware, compose } from 'redux';
import reducers from './reducers';

// Middleware

import { createLogger } from 'redux-logger';
import network from '../store/middleware/network';

// ----------------

export default function(initialState) {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  return createStore(
    reducers,
    initialState,
    composeEnhancers(
    applyMiddleware(
      network(),
      createLogger({
        collapsed: true
      })
    )
  )
  );
}
