import { Redirect } from 'react-router-dom';
import React from 'react';
import query from 'querystringify';

// Constants

import { _global, history, redirectPath, localStorageNames, displayAppName } from '../../constants';

// ----------------

/**
  // Page title

  static title: string;

  // Sets whether the user should be authorized or unauthorized to access the page
  // If the static property "type" is not existed, then all users have access to this page

  static access: "auth" | "unauth";

  // Query params required to access the page

  static queryForAccess: Array<string>;

  // The path (Route) at which the component will be rendered

  static path: string;

  // If the route is a tab

  static asTab: { displayName: string, queryName: string, deleteQuery: Array<string> };

  // Permission required to access the page

  static permission: string;

  // An array of action creators, that will be called when sub route or query params have been changed

  pathUpdate: Array<Function>;

  // An array of action creators, that will be called when leaving the page

  unmount: Array<Function>;

  // Action creators for the first page render

  mount: Array<{ ac: Function, mapState?: Array<string> }>;
 */

export default class Page extends React.Component {
  constructor(props) {
    super(props);

    const pageInfo = this.constructor;
    this.redirectTo = '';

    // Verifying user authorization, if necessary

    if (pageInfo.access) {
      const token = localStorage.getItem(localStorageNames.token);

      if (token) {
        // If token exist

        if (pageInfo.access === 'unauth') {
          this.redirectTo = redirectPath.withToken;
          return;
        }
      } else if (pageInfo.access === 'auth') {
        // If token not exist, but user should be authorized

        this.redirectTo = redirectPath.withoutToken;
        return;
      }
    }

    // Verifying query params required to access the page

    if (pageInfo.queryForAccess && pageInfo.queryForAccess.length) {
      const queryObject = query.parse(history.location.search);

      if (!pageInfo.queryForAccess.every(item => queryObject[item])) {
        this.redirectTo = redirectPath.withoutToken;
        return;
      }
    }

    // Verifying user permission, if necessary

    if (pageInfo.permission) {
      // const { permissions } = _global.store.getState().user;
      // const access = permissions.some(permission => permission.code === pageInfo.permission);
      // if (!access) {
      //   this.redirectTo = 'no-access';
      //   return;
      // }
    }

    // If the user has access to the page

    if (!this.redirectTo) {
      if (pageInfo.hasOwnProperty('title')) {
        document.title = `${pageInfo.title} | ${displayAppName}`;
      }

      this.currentPath = history.location.pathname + history.location.search;
    }
  }

  // -------- Utils --------

  securRenderPage(PageLayout) {
    return this.redirectTo ? (
      this.redirectTo === 'no-access' ? (
        // Return access component
        'No access'
      ) : (
        <Redirect to={this.redirectTo} />
      )
    ) : (
      <PageLayout />
    );
  }

  // -------- Life cycle --------

  /**
   *  Dispatch action creators on the first render, if necessary
   */

  componentDidMount() {
    const state = _global.store.getState();
    const array = this.mount;

    if (!array || !array.length) return;

    array.forEach(item => {
      if (item.mapState) {
        // By condition

        let prop = state;
        item.mapState.forEach(mapItem => {
          prop = prop[mapItem];
        });

        switch (typeof prop) {
          case 'object': {
            if (prop === null) _global.store.dispatch(item.ac(item.payload || {}));
            if (prop instanceof Array && !prop.length)
              _global.store.dispatch(item.ac(item.payload || {}));
            else if (!Object.keys(prop).length) _global.store.dispatch(item.ac(item.payload || {}));

            break;
          }

          default: {
            if (!prop) {
              _global.store.dispatch(item.ac(item.payload || {}));
            }
          }
        }
      } else {
        // On every first render

        _global.store.dispatch(item.ac(item.payload || {}));
      }
    });
  }

  /**
   *  Dispatch action creators, when path was updated, but the page has not changed
   */

  componentDidUpdate() {
    if (this.currentPath !== history.location.pathname + history.location.search) {
      this.currentPath = history.location.pathname + history.location.search;
      const array = this.pathUpdate;

      if (!array || !array.length) return;

      array.forEach(ac => {
        _global.store.dispatch(ac());
      });
    }
  }

  /**
   *  Dispatch action creators, when page will unmount
   */

  componentWillUnmount() {
    const array = this.unmount;

    if (!array || !array.length) return;

    array.forEach(ac => {
      _global.store.dispatch(ac());
    });
  }
}
