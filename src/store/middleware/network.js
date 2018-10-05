/**
 * Middleware for network request
 */

import createActionType from '../../modules/createActionType';
import fetch from '../../modules/fetch';

// ----------------

export default function() {
  return ({ dispatch, getState }) => next => actionCreator => {
    if (typeof actionCreator === 'function') {
      return actionCreator(dispatch, getState);
    }

    const {
      networkType,
      thenError,
      endpoint,
      payload,
      before,
      method,
      then,
      ...rest
    } = actionCreator;

    if (!networkType) {
      return next(actionCreator);
    }

    next({ type: networkType, ...rest });

    let query = '';

    if (before) query = before();

    const promise = fetch(endpoint(query), {
      method: method || 'GET',
      body: JSON.stringify(payload)
    });

    (async () => {
      try {
        const result = await promise;

        next({
          type: createActionType(networkType),
          result,
          ...rest
        });

        if (then) then(result, dispatch, getState);
      } catch (error) {
        const errorInfo = error;

        switch (errorInfo.code) {
          case 401: {
            // Logout
            break;
          }

          case 404: {
            // Redirect
            break;
          }

          default: {
            next({
              type: createActionType(networkType, 'err'),
              errorInfo
            });

            if (thenError) thenError(errorInfo);
          }
        }
      }
    })();

    return promise;
  };
}
