import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';
import ReactPaginate from 'react-paginate';

// Styles

import './styles.scss';

// Image and icons

import collapseIcon from '../../../static/img/icons/chevron_right.svg';

// ----------------

// Type of props

Pagination.propTypes = {
  className: types.string,
  pageCount: types.number,
  style: types.object
};

// Default value for props

Pagination.defaultProps = {
  className: ''
};

// Modify styles

const pagButtonStyle = props =>
  classNames({
    'pagination-block__btn--prev': props.side === 'prev',
    'pagination-block__btn--next': props.side === 'next'
  });

// Button component

const NavButton = props => (
  <div className={`pagination-block__btn ${pagButtonStyle(props)}`}>
    <ReactSVG src={collapseIcon} />
  </div>
);

// ----------------

export default function Pagination(props) {
  const { className, style, pageCount } = props;

  return (
    <div className={`pagination-block ${className}`} style={style}>
      <ReactPaginate
        previousLabel={<NavButton side="prev" />}
        nextLabel={<NavButton side="next" />}
        breakLabel={<a>...</a>}
        breakClassName="break-me"
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        onPageChange={() => {}}
        containerClassName="pagination"
        subContainerClassName="pages pagination"
        activeClassName="active"
      />
    </div>
  );
}
