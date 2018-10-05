export default require(`./${process.env.REACT_APP_HOST_ENV || 'development'}.js`).default;
