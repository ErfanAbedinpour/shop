exports.getHome = (req, res, next) => {
  try {
    const contex = {
      title: "فروشگاه رویسر"
    }
    res.render('index', contex)
  } catch (error) {
    error.status = 500;
    next(error)
  }
}
