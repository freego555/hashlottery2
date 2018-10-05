import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// Constants

import { redirectPath } from '../../constants';

// Components

import { Page, MainStruct } from '../../components';

// Sub routes

const subRoutes = [
  require('./new-message').default,
  require('./new-patient').default,
  require('./dashboard').default,
  require('./messages').default,
  require('./patients').default,
  require('./patient').default,
  require('./archive').default,
  require('./task').default
];

// ----------------

export default class MainPage extends Page {
  // Route config

  static access = 'auth'; // This prop only for top-level pages
  static path = '/main';

  // Bind methods

  pageContent = this.pageContent.bind(this);

  // -------- Methods --------

  // Content of route

  pageContent() {
    const aside = /^\/main\/patients\/\d+/.test(this.props.location.pathname);

    return (
      <MainStruct aside={aside}>
        <Switch>
          {subRoutes.map(route => (
            <Route path={route.path} component={route} key={route.path} exact={route.exactPath} />
          ))}
          <Route component={() => <Redirect to={redirectPath.withToken} />} />
        </Switch>
      </MainStruct>
    );
  }

  // Render

  render() {
    return this.securRenderPage(this.pageContent);
  }
}
