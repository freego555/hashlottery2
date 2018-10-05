import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Constants

import { redirectPath } from '../../constants';

// Components

import { Page, AuthStruct } from '../../components';

// Sub routes

const subRoutes = [
  require('./resetPassword').default,
  require('./newPassword').default,
  require('./login').default
];

// ----------------

export default class AuthPage extends Page {
  // Page (Route) config

  static access = 'unauth';
  static path = '/auth';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of page (Route)

  pageContent() {
    return (
      <AuthStruct>
        <Switch>
          {subRoutes.map(route => (
            <Route path={route.path} component={route} key={route.path} />
          ))}
          <Route component={() => <Redirect to={redirectPath.withoutToken} />} />
        </Switch>
      </AuthStruct>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
