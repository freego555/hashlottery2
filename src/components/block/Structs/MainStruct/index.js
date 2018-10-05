import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';

// Components

import { MainNavigationBar, MainAsideBar, MainContent, MainHeader, Container } from '../../../';

// Action creators

import { addActiveUI } from '../../../../store/actionCreators/ui';

// Styles

import './styles.scss';

// ----------------

// Type of props

MainStruct.propTypes = {
  className: types.string,
  children: types.node,
  style: types.object,
  aside: types.bool
};

// Default value for props

MainStruct.defaultProps = {
  className: ''
};

// Modify styles

const modify = props =>
  classNames({
    'main-structure--aside': props.aside
  });

// ----------------

const toggleProfileMenu = () => addActiveUI({ name: 'profileMenu' });
const toggleAsideBlock  = () => addActiveUI({ name: 'aside' }); // prettier-ignore

// ----------------

export default function MainStruct(props) {
  const { className, style, children, aside } = props;

  return (
    <div className={`main-structure ${modify(props)} ${className}`} style={style}>
      <MainContent className="main-structure__content">{children}</MainContent>
      <Container
        mapState={state => ({ isAsideOpen: state.ui.activeUI.aside })}
        mapDispatch={{ toggleAsideBlock }}
        childProps={{ className: 'main-structure__header' }}
        aside={aside}
      >
        {MainHeader}
      </Container>
      {aside && (
        <Container
          mapState={state => ({ isAsideOpen: state.ui.activeUI.aside })}
          childProps={{ className: 'main-structure__aside' }}
        >
          {MainAsideBar}
        </Container>
      )}
      <Container
        mapDispatch={{ toggleProfileMenu }}
        childProps={{ className: 'main-structure__nav' }}
        withRouter
      >
        {MainNavigationBar}
      </Container>
      {/* <Container
        mapState={state => ({ isProfileMenuOpen: state.ui.activeUI.profileMenu })}
        childProps={{ className: 'main-structure__profile-menu' }}
        mapDispatch={{ toggleProfileMenu: () => addActiveUI({ name: 'profileMenu' }) }}
      >
        {ProfileMenu}
      </Container> */}
    </div>
  );
}
