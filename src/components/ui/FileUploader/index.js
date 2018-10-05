import React from 'react';
import types from 'prop-types';
import classNames from 'classnames';
import ReactSVG from 'react-svg';

// Constants

import { acceptedFormats } from '../../../constants';

// Components

import { FieldWrapper } from '../../../components';

// Styles

import './styles.scss';

// Images

import fileIcon from '../../../static/img/icons/file.svg';
import attach from '../../../static/img/icons/attach.svg';
import x_small from '../../../static/img/icons/x_small.svg';

// ----------------

// Type of props

FileUploader.propTypes = {
  onFileSelect: types.func.isRequired,
  uploadedFiles: types.array,
  placeholder: types.string,
  onFileDelete: types.func,
  className: types.string,
  multiple: types.bool,
  title: types.string,
  error: types.string,
  style: types.object,
  name: types.string,
  ctx: types.object
};

// Default value for props

FileUploader.defaultProps = {
  className: ''
};

// Modify styles

const modifyFieldWrapper = props =>
  classNames({
    'ui-field-wrapper__block--full-width': props.fullWidth
  });

const modifyButton = (props, error) =>
  classNames({
    'file-uploader__icon--error': error
  });

const modify = (props, error) =>
  classNames({
    'file-uploader--error': error
  });

// ----------------

export default function FileUploader(props) {
  const {
    uploadedFiles,
    onFileSelect,
    onFileDelete,
    placeholder,
    className,
    multiple,
    style,
    title,
    error,
    name,
    ctx
  } = props;

  return (
    <FieldWrapper
      title={title}
      error={error || ctx.state.status[name]}
      className={`${modifyFieldWrapper(props)} ${className}`}
    >
      <div
        className={`file-uploader ${modify(props, error || ctx.state.status[name])}  ${className}`}
        style={style}
      >
        <label id="upload-area" htmlFor="file-uploader" className="file-uploader__label">
          <div
            className={`file-uploader__icon ${modifyButton(
              props,
              error || ctx.state.status[name]
            )}`}
          >
            <ReactSVG src={attach} />
          </div>
          <input
            name={name}
            className="file-uploader__input"
            accept={acceptedFormats}
            onChange={onFileSelect}
            multiple={multiple}
            id="file-uploader"
            type="file"
          />
        </label>
        <div className="file-uploader__description">
          {uploadedFiles.length
            ? uploadedFiles.map(file => (
                <div className="file-uploader__item-wrapper" key={file.id}>
                  <div className="file-uploader__attached-icon">
                    <ReactSVG src={fileIcon} />
                  </div>
                  <div className="file-uploader__item">
                    {file.content.name.length > 15
                      ? `${file.content.name.slice(0, 10)}...${file.content.name.slice(-4)}`
                      : file.name}
                  </div>
                  <div className="file-uploader__remove" onClick={() => onFileDelete(file.id)}>
                    <ReactSVG src={x_small} />
                  </div>
                </div>
              ))
            : placeholder}
        </div>
      </div>
    </FieldWrapper>
  );
}
