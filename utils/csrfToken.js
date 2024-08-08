const Tokens = require("csrf");

function genCsrfToken(req, res, next) {
    const tokens = new Tokens();
    tokens.secret(function (err, secret) {
        if (err) return next(err);
        const token = tokens.create(secret);
        req.session.csrf = {
            secret,
            token,
        };
        next();
    });
}

function verifyCsrfToken(req, res, next) {
    const tokens = new Tokens();
    const { csrf_token } = req.body;
    if (!tokens.verify(req.session?.csrf?.secret, csrf_token)) {
        req.flash("errors", [{ msg: "لطفا توکن معتبر وارد کنید" }]);
        return res.redirect(req.originalUrl);
    }
    next();
}

module.exports = {
    genCsrfToken,
    verifyCsrfToken,
};
