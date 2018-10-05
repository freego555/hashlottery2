import React from 'react';
import types from 'prop-types';
import { connect } from 'react-redux';
import deleteProps from '../../modules/deleteProps';
import { withRouter } from 'react-router';

// ----------------

export default class Container extends React.Component {
  // Type of props

  static propTypes = {
    mapDispatch: types.object,
    withRouter: types.bool,
    childProps: types.object,
    mapState: types.func,
    children: types.func.isRequired
  };

  // -------- Methods --------

  constructor(props) {
    super(props);

    this.childWrapper = containerProps => (
      <props.children {...(props.childProps ? props.childProps : {})} {...containerProps} />
    );

    this.childWrapper.displayName = `${props.children.name}Wrapper`;

    this.container = connect(
      props.mapState    || null, // prettier-ignore
      props.mapDispatch || null
    )(this.childWrapper);

    if (props.withRouter) this.container = withRouter(this.container);
  }

  render() {
    return (
      <this.container
        {...deleteProps(this.props, [
          'mapDispatch',
          'childProps',
          'withRouter',
          'mapState',
          'children'
        ])}
      />
    );
  }
}
