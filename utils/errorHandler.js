const { validationResult } = require('express-validator')

function checkValidatorResult(redirectUrl) {
  return function(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array())
      return res.redirect(redirectUrl);
    }
    next();
  }
}

module.exports = checkValidatorResult 
