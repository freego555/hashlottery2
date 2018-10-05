export default {
  string: {
    max: 100
  },

  email: {
    regExp: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,5}))$/ // eslint-disable-line
  },

  password: {
    min: 8
  },

  empty: {
    min: 1
  },

  files: {
    optional: true,
    max: 5
  }
};
