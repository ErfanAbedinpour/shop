const { validationResult } = require('express-validator');
const { redirect } = require('../helper/redirect');


function checkValidatorResult(redirectUrl = null) {
  return function(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      redirectUrl = redirectUrl ? redirectUrl : req.originalUrl;
      req.flash('errors', result.array())
      return redirect(req, res, 400, redirectUrl)
    }
    next();
  }
}

module.exports = checkValidatorResult 
