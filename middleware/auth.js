module.exports.isAdmin = (req, res, next) => {
    if (req.session && req.session.admin) return next();
    req.flash('error', 'Please login to access the admin panel');
    res.redirect('/admin/login');
};
