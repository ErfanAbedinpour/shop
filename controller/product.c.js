const { validationResult } = require('express-validator')

const tables = require('../models/tables');

exports.createPost = (req, res, next) => {
  try {
    const result = validationResult(req)
    if (!result.isEmpty()) {

    }
  } catch (error) {
    error.status = 500;
    next(error)
  }
}
