import React from 'react';
import types from 'prop-types';

// Constants

import { _global } from '../../../../constants';
import rules from '../../../../constants/validation';

// Components

import { Input, Textarea, Button, FileUploader, MultiSelect } from '../../../../components';
import Form from '../../../core/Form';

// Styles

import './styles.scss';

// ----------------

export default class NewMessageForm extends Form {
  // Type of props

  static propTypes = {
    className: types.string,
    style: types.object
  };

  // Default value for props

  static defaultProps = {
    className: ''
  };

  constructor(props) {
    super(props);

    // State of component

    this.state = {
      form: {
        receivers: [],
        subject: '',
        msg_content: '',
        files: []
      },
      options: [],
      selectedOption: null
    };

    // Validation rules

    this.rules = {
      receivers: { ...rules.empty, message: _global.lan.ui.input.sendTo.message },
      subject: { ...rules.empty, message: _global.lan.ui.input.subject.message },
      msg_content: { ...rules.empty, message: _global.lan.ui.input.message.message },
      files: { ...rules.files, message: _global.lan.ui.input.files.message }
    };

    // Bind methods, that are going to be called as an event handlers

    // ...

    // Init form

    this.init();
  }

  // -------- Methods --------

  // Change receivers multiselect

  handleChange = selectedOption => {
    const receivers = selectedOption.map(opt => opt.value);
    this.setState({ selectedOption, form: { ...this.state.form, receivers } });
  };

  // Methods for <FileUploader>

  onFileSelect = event => {
    const uploadedFiles = [...event.target.files].map(file => {
      return {
        id: `${file.name}${Date.now()}${Math.floor(Math.random() * 100)}`,
        content: file
      };
    });
    const files = [...this.state.form.files, ...uploadedFiles];
    this.setState({ form: { ...this.state.form, files } });
    event.target.value = null;
  };

  onFileDelete = fileId => {
    const files = this.state.form.files.filter(file => file.id !== fileId);
    this.setState({ form: { ...this.state.form, files } }, () => this.validateField('files'));
  };

  // Convert array of attached files to base64 format before send to the backend

  convertArrayToBase64 = async files => {
    if (!files.length) return;
    const promises = files.map(async file => await this.convertFileToBase64(file));
    return await Promise.all(promises);
  };

  convertFileToBase64 = async file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(readerEvt) {
        resolve(
          `${file.content.name.slice(0, file.content.name.length - 4)};name;${
            readerEvt.target.result
          }`
        );
      };
      reader.readAsDataURL(file.content);
    });
  };

  // Submit form with async converting files in base64 format

  submitHandler = () => {
    this.validateAll(() => {
      if (this.submitAction) {
        if (Object.keys(this.state.status).length) this.setState({ status: {} });
        (async () => {
          const files = await this.convertArrayToBase64(this.state.form.files);
          this.submitAction({ ...this.state.form, files }, this.successCallBack);
        })();
      }
    });
  };

  // Render

  render() {
    const { className, style, networkProcess, fetchingUsersProcess } = this.props;
    const { selectedOption } = this.state;
    const { files } = this.state.form;
    const { lan } = _global;
    const options = this.props.users.map(user => {
      return {
        value: user.pk,
        label: user.username
      };
    });

    return (
      <div className={`new-message-form ${className}`} style={style}>
        <div className="new-message-form__input-wrapper">
          <MultiSelect
            isNetworkProcess={fetchingUsersProcess && fetchingUsersProcess.status === 'loading'}
            isDisabled={fetchingUsersProcess && fetchingUsersProcess.status === 'loading'}
            placeholder={lan.ui.input.sendTo.base.placeholder}
            classNamePrefix="multi-select"
            onChange={this.handleChange}
            className="multi-select"
            value={selectedOption}
            options={options}
            name="receivers"
            isSearchable
            ctx={this}
            fullWidth
            isMulti
          />
        </div>
        <div className="new-message-form__input-wrapper">
          <Input {...lan.ui.input.subject.base} name="subject" ctx={this} fullWidth />
        </div>
        <div className="new-message-form__input-wrapper">
          <Textarea {...lan.ui.input.message.base} name="msg_content" ctx={this} fullWidth />
        </div>
        <div className="submit-group">
          <div className="submit-group__file-uploader">
            <FileUploader
              placeholder={lan.ui.input.files.base.placeholder}
              onFileSelect={this.onFileSelect}
              onFileDelete={this.onFileDelete}
              uploadedFiles={files}
              name="files"
              ctx={this}
              fullWidth
            />
          </div>
          <div className="submit-group__submit-button">
            <Button status={networkProcess && networkProcess.status} onClick={this.submitHandler}>
              {lan.ui.button.sendMessage}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
