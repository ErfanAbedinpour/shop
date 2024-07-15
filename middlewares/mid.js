const isNotAuth = (req, res, next) => {
  try {

  } catch (error) {
    error.status = 500;
    next(error)
  }
}
