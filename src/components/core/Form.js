import React from 'react';

// Constants

import { _global } from '../../constants';

// ----------------

export default class Form extends React.Component {
  constructor(props) {
    super(props);

    // Bind methods, that are going to be called as an event handlers

    this.changeHandler = this.changeHandler.bind(this);
    this.focusHandler  = this.focusHandler.bind(this); // prettier-ignore
    this.blurHandler   = this.blurHandler.bind(this); // prettier-ignore
    this.submitHandler = this.submitHandler.bind(this);

    // Set action creator on submit

    if (props.submitAction) this.submitAction = props.submitAction;
  }

  // -------- Handlers --------

  changeHandler(e) {
    const { target } = e;

    this.setState(prevState => ({
      form: {
        ...prevState.form,
        [target.name]: target.value
      }
    }));
  }

  blurHandler(e) {
    const { target } = e;
    if (this.rules && this.rules[target.name]) this.validateField(target.name);
  }

  focusHandler(e) {
    const { target } = e;
    if (this.state.status[target.name]) {
      this.setState(prevState => ({ status: { ...prevState.status, [target.name]: null } }));
    }
  }

  submitHandler() {
    this.validateAll(() => {
      if (this.submitAction) {
        if (Object.keys(this.state.status).length) this.setState({ status: {} });
        this.submitAction(
          this.transformForm ? this.transformForm(this.state.form) : this.state.form,
          this.successCallBack
        );
      }
    });
  }

  // -------- Utils --------

  init() {
    const { state } = this;

    if (!state) {
      throw new Error('Component who extends from the "Form" module, must have state prop');
    }

    if (!state.form) {
      throw new Error('State must have form prop');
    }

    this.state = { ...this.state, status: {} };
  }

  validateField(fieldName, emptyTest = false) {
    const rules = this.rules[fieldName];
    if (!rules) return true;

    const { regExp, min, max, confirm, optional, accept } = rules;
    let { type, message } = rules;
    const value = this.state.form[fieldName];

    if (!type || (type !== 'number' || type !== 'file')) {
      type = typeof value;
    }

    if (!message) message = _global.lan.ui.message;
    else message = { ..._global.lan.ui.message, ...message };

    // Empty test

    let isEmpty;

    switch (type) {
      case 'string': {
        if (value.length === 0) isEmpty = true;
        break;
      }

      case 'object': {
        if (Array.isArray(value) && value.length === 0) isEmpty = true;
        // prettier-ignore
        else if (value === null) isEmpty = true;
        else if (!Object.keys(value).length) isEmpty = true;

        break;
      }

      // boolean, number

      default: {
        isEmpty = false;
      }
    }

    if (isEmpty && emptyTest && !optional) {
      this.setState(prevState => ({
        status: { ...prevState.status, [fieldName]: message.empty }
      }));

      return false;
    }

    if (!isEmpty) {
      let fileObj;

      if (type === 'file') {
        fileObj = value.file;

        // File accept test

        if (accept) {
          if (!accept.some(type => fileObj.type.indexOf(type) >= 0)) {
            this.setState(prevState => ({
              status: {
                ...prevState.status,
                [fieldName]: { message: message.accept }
              }
            }));
            return false;
          }
        }
      }

      // Confirm test

      if (confirm) {
        if (value !== this.state.form[confirm]) {
          this.setState(prevState => ({
            status: { ...prevState.status, [fieldName]: message.confirm }
          }));

          return false;
        }
      }

      // Min length test

      if (min) {
        let result = true;

        switch (type) {
          case 'string': {
            if (value.length < min) result = false;
            break;
          }

          case 'object': {
            if (Array.isArray(value)) {
              if (value.length < min) result = false;
            } else {
              if (!Object.keys(value).length < min) isEmpty = true;
            }

            break;
          }

          case 'number': {
            if (value < min) result = false;
            break;
          }

          case 'file': {
            if (fileObj.size < min) result = false;
            break;
          }

          default: {
            result = false;
          }
        }

        if (!result) {
          this.setState(prevState => ({
            status: { ...prevState.status, [fieldName]: message.min }
          }));

          return false;
        }
      }

      // Max length test

      if (max) {
        let result = true;

        switch (type) {
          case 'string': {
            if (value.length > max) result = false;
            break;
          }

          case 'object': {
            if (Array.isArray(value)) {
              if (value.length > max) result = false;
            } else {
              if (!Object.keys(value).length > max) isEmpty = true;
            }

            break;
          }

          case 'number': {
            if (value > max) result = false;
            break;
          }

          case 'file': {
            if (fileObj.size > max) result = false;
            break;
          }

          default: {
            result = false;
          }
        }

        if (!result) {
          this.setState(prevState => ({
            status: { ...prevState.status, [fieldName]: message.max }
          }));

          return false;
        }
      }

      // RegExp test

      if (regExp) {
        if (!regExp.test(value)) {
          this.setState(prevState => ({
            status: { ...prevState.status, [fieldName]: message.regExp }
          }));

          return false;
        }
      }
    }

    if (this.state.status[fieldName]) {
      this.setState(prevState => ({ status: { ...prevState.status, [fieldName]: null } }));
    }

    return true;
  }

  validateAll(callBack) {
    if (!this.rules) {
      if (callBack) callBack();
      return true;
    }

    let errors = 0;
    const keys = Object.keys(this.rules);

    keys.forEach(key => {
      if (!this.validateField(key, true)) {
        errors++;
      }
    });

    if (errors === 0) {
      if (callBack) callBack();
      return true;
    }

    return false;
  }

  // -------- Life cycle --------

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const propsKeys = Object.keys(this.props);
      let nextStatus = {};
      const regExp = /networkProcess$/;

      propsKeys.forEach(propKey => {
        if (regExp.test(propKey)) {
          const networkProcess = this.props[propKey];

          if (networkProcess && networkProcess.status === 'error' && networkProcess.code === 400) {
            const errors = networkProcess.object;
            const errorKeys = Object.keys(errors);

            errorKeys.forEach(errorKey => {
              nextStatus = { ...nextStatus, [errorKey]: errors[errorKey][0] };
            });
          }
        }
      });

      const nextStatusKeys = Object.keys(nextStatus);

      if (nextStatusKeys.length > 0) {
        this.setState(prevState => ({
          status: { ...prevState.status, ...nextStatus }
        }));
      }
    }
  }
}
