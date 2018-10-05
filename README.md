## Launching

To start in the develop mode:

```
npm start
```

To build the project:

```
npm run build
```

## Code style and rules

The code in this project should correspond with agreements described below

### Component with state template

```
import React from 'react';
import types from 'prop-types';

// Constants

// import {} from '../../constants';

// Components

// import {} from '../';

// Modules

// import {} from '../../modules';

// Styles

// import './styles.scss';

// ----------------

export default class Name extends React.Component {
  // Type of props

  static propTypes = {
    className: types.string,
    style: types.object
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
    const { className, style } = this.props;

    return <div className={`name ${className}`} style={style} />;
  }
}
```

### Functional component template

```
import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Constants

// import {} from '../../constants';

// Components

// import {} from '../';

// Modules

// import {} from '../../modules';

// Styles

// import './styles.scss';

// ----------------

// Type of props

Name.propTypes = {
  className: types.string,
  style: types.object
};

// Default value for props

Name.defaultProps = {
  className: ''
};

// Modify styles

const modify = props => classNames({});

// ----------------

export default function Name(props) {
  const { className, style } = props;

  return <div className={`name ${modify(props)} ${className}`} style={style} />;
}
```
