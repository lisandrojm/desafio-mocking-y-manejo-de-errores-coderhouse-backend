/* ************************************************************************** */
/* /src/utils/errors/index.js */
/* ************************************************************************** */

const eErrors = require('./services/enums');

module.exports = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case eErrors.INVALID_TYPES_ERROR:
      res.send({ status: 'error', error: error.name });
      break;
    default:
      res.send({ status: 'error', error: 'Unhandled error' });
  }
};
