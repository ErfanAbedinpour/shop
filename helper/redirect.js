exports.redirect = function (req, res, status = 200, to = req.originalUrl) {
  req.session.save((err) => {
    res.status(status);
    res.redirect(to);
  });
};
