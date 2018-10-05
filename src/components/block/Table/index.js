import React from 'react';
import types from 'prop-types';
import ReactSVG from 'react-svg';
import classNames from 'classnames';

// Components

import { List, Pagination } from '../../../components';

// Modules

import deleteProps from '../../../modules/deleteProps';

// Styles

import './styles.scss';

// Icons

import sortIcon from '../../../static/img/icons/sort_grey.svg';

// ----------------

export default class Table extends React.Component {
  // Type of props

  static propTypes = {
    className: types.string,
    rowDesktop: types.func.isRequired,
    rowMobile: types.func.isRequired,
    columns: types.array.isRequired,
    style: types.object,
    mobile: types.bool
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  // State of component

  state = {
    isMobileSize: false
  };

  // Bind methods, that are going to be called as an event handlers

  // ...

  // -------- Methods --------

  // Render

  render() {
    const {
      HTTPProcess,
      rowDesktop,
      rowMobile,
      className,
      columns,
      mobile,
      style,
      list
    } = this.props;
    const Row = mobile ? rowMobile : rowDesktop;

    // Modify styles

    const modifyHeaderLi = item =>
      classNames({
        'table__header-list-li-inner--active': this.currentSort === item.sort.name
      });

    const modifyBodyScroll = props =>
      classNames({
        'table__body--scroll': !!props.scrollHeight
      });

    return (
      <div className={`table ${className}`} style={style}>
        {!mobile && (
          <div className="table__header">
            <div className="table__header-list">
              {columns.map(
                item =>
                  item.sort ? (
                    <div
                      className="table__header-list-li"
                      style={{
                        width: `${item.width}%`,
                        minWidth: `${item.width}%`
                      }}
                      key={item.label}
                    >
                      <div
                        className={`table__header-list-li-inner ${modifyHeaderLi(item)}`}
                        onClick={() => this.sortHandler(item.sort)}
                      >
                        <span>{item.label}</span>
                        <div className="table__sort-icon-wrapper">
                          <ReactSVG src={sortIcon} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="table__header-list-li"
                      key={item.label}
                      style={{ width: `${item.width}%`, minWidth: `${item.width}%` }}
                    >
                      {item.label}
                    </div>
                  )
              )}
            </div>
          </div>
        )}
        <div className={`table__body ${modifyBodyScroll(this.props)}`}>
          <List
            columnWidth={columns.map(item => item.width)}
            HTTPProcess={HTTPProcess}
            listItem={Row}
            list={list}
            {...deleteProps(this.props, ['row'])}
          />
        </div>
        <div className="table__pagination-block">
          <Pagination pageCount={8} />
        </div>
      </div>
    );
  }
}
