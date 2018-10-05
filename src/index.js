import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, Switch, Redirect, Router } from 'react-router-dom';

// Constants

import { _global, history, localStorageNames, redirectPath } from './constants';
import { FETCH_USER_DATA } from './constants/endpoints';

// Modules

import registerServiceWorker from './modules/registerServiceWorker';
import resize from './modules/resize';
import fetch from './modules/fetch';

// Store creator

import createStore from './store';

// Styles

import './style/fonts/index.scss';
import './style/index.scss';

// ----------------

(async () => {
  // -------- Operations that need to be done before the first render --------

  const token = localStorage.getItem(localStorageNames.token);
  const lan = localStorage.getItem(localStorageNames.lan);
  let store;

  if (token) {
    // It is assumed that the user is authorized
    const user = {
      permissions: [],
      data: {}
    };

    try {
      const result = await fetch(FETCH_USER_DATA, {
        method: 'post',
        body: JSON.stringify({ token })
      });

      user.permissions = result.permissions;
      user.data = result.user;
      store = createStore({ user });
    } catch (error) {
      store = createStore();
      // store.dispatch(logout());
      return;
    }
  } else {
    // User is not authorized
    store = createStore();
  }

  _global.store = store;
  const _lan = await import(`./constants/languages/${lan || 'en'}`);
  _global.lan = _lan.default;

  const topLevelRoutes = require('./routes').default;

  function App() {
    return (
      <div className="app">
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route
                exact
                path="/"
                component={() => (
                  <Redirect to={token ? redirectPath.withToken : redirectPath.withoutToken} />
                )}
              />
              {topLevelRoutes.map(route => (
                <Route path={route.path} component={route} key={route.path} />
              ))}
              <Route component={() => '404'} />
            </Switch>
          </Router>
        </Provider>
      </div>
    );
  }

  // -------- Render app --------

  ReactDOM.render(<App />, document.getElementById('root'));

  // -------- Operations that need to be done after the first render --------

  // Register service worker

  registerServiceWorker();

  // Scroll window to the top on route change

  history.listen(() => {
    window.scrollTo(0, 0);
  });

  // Changing version of app on window resize

  resize();
})();
