var express 		= require("express"),
	router			= express.Router(),
	User			= require("../models/user"),
	middleware		= require("../middleware"),
	passport		= require("passport"),
	LocalStrategy	= require("passport-local"),
	Patient			= require("../models/patient")



router.get('/', function(req,res){
	res.render("landing");
});

router.get('/index', middleware.isLoggedIn, function(req,res){
	if (req.user.role === 0){
		return res.redirect('/admin');
	}
	else if (req.user.role === 2) {
		return res.redirect("/doctor");
	}
	res.redirect("/patient");
});




// Auth Routes

//Register
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	var newPatient = new Patient({name:req.body.name, email:req.body.email}) ;
	newPatient.save();
	var newUser = new User({name : req.body.name, username : req.body.email, role:1});
	
	
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err.message);
			req.flash('error', err.message);
			return res.redirect("/register");
		}
		else{
				passport.authenticate("local")(req,res,function(){
				return res.redirect("/index");
			});
		}
	});
	
	res.redirect("/login")
	
});



//Login

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local",
	{
		successRedirect : '/index',
		failureRedirect : '/login'
	}) , function(req, res){	
	return res.redirect("/index");
});

router.get("/change_pass", function(req,res){
	res.render("change_pass");
});

router.post("/change_pass", function(req,res){
	User.findOne({username:req.body.username},function(err, user){
		if(err){
			req.flash("err", err.message);
			return res.redirect("/change_pass");
		}
		user.changePassword(req.body.oldpassword, req.body.newpassword, function(error, updatedUser) {
			if(error){
				req.flash("error", error.message);
				return res.redirect("/");
			}
			req.flash("success", "Password changed Successfully");
			res.redirect("/login");

		});
	});
});

router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","Logged OUT");
	return res.redirect("/");
});



module.exports = router;