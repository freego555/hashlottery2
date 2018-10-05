import React from 'react';
import types from 'prop-types';

// ----------------

export default class Steps extends React.Component {
  // Type of props

  static propTypes = {
    headerClassName: types.string,
    bodyClassName: types.string,
    className: types.string,
    children: types.array, // Array of steps
    header: types.func, // Component with steps header
    style: types.object,
    name: types.string // Name of steps group
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  // State of component

  state = {};

  // Bind methods, that are going to be called as an event handlers

  // ...

  // -------- Methods --------

  // Render

  render() {
    const {
      activeStepIndex,
      headerClassName,
      bodyClassName,
      className,
      children,
      header: Header,
      style,
      body: Body
    } = this.props;

    const Step = children[activeStepIndex];

    return (
      <div className={`steps ${className}`} style={style}>
        <Header
          activeStepIndex={activeStepIndex}
          className={headerClassName}
          steps={children.map(step => step.asStep)}
        />
        <Body className={bodyClassName}>
          <Step />
        </Body>
      </div>
    );
  }
}
