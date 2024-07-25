const { validationResult } = require('express-validator');
const { redirect } = require('../helper/redirect');


function checkValidatorResult(redirectUrl) {
  return function(req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      req.flash('errors', result.array())
      return redirect(req,res,400)
    }
    next();
  }
}

module.exports = checkValidatorResult 
