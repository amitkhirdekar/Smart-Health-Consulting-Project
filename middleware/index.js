var flash = require("connect-flash");

//middlewares
var middleware = {};
middleware.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash('error','You need to be logged in!');
	res.redirect("/login")
}

middleware.isAdmin = function(req, res, next){
	if (req.user.role !== 0){
		req.flash("error","You dont have permissions to do it");
		return res.redirect("/index");
	}
	return next();
}
middleware.isDoctor = function(req, res, next){
	if (req.user.role !== 2){
		req.flash("error","You dont have permissions to do it");
		return res.redirect("/index");
	}
	return next();
}
module.exports = middleware
