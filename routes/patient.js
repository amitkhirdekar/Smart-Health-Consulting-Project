const { isDoctor } = require("../middleware");

var express 		= require("express"),
	router			= express.Router({mergeParams:true}),
	Patient			= require("../models/patient"),
	middleware		= require("../middleware"),
	User			= require("../models/user"),
	Medical_Records	= require("../models/med_records"),
	Doctor			= require("../models/doctor")


router.get("/getdocs", middleware.isLoggedIn, function(req,res){
	Doctor.find({}, function(err, allDoctors){
		if(err || allDoctors == null){
			console.log(err.message);
			return res.redirect("/patient");
		}
		else{
			return res.render("./patient/getdocs",{doctors:allDoctors});
		}
	});
});
	
	
//show Patient Dashboard
router.get("/", middleware.isLoggedIn, function(req,res){
	Patient.findOne({'email' : req.user.username}, function(err, allPatients) {
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/index",{patient:allPatients, user:req});
		}
	});
});


//Show Patient Details
router.get("/:id", middleware.isLoggedIn, function(req,res){
	Patient.findById(req.params.id).populate("medical_record").exec(function(err, patient){
		if(err){
			console.log(err);
		}
		else{
			res.render("./patient/show" ,{patient:patient});
		}
	});
});

//Edit Patient Profile
router.get("/:id/edit", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
	Patient.findById(req.params.id, function(err, foundPatient){
		res.render("./patient/edit", {patient : foundPatient});
	});
});


router.put("/:id", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
    Patient.findByIdAndUpdate(req.params.id, req.body.patient, function(err, updatedPatient){
		if(err){
			req.flash("error", err.message);
			res.redirect("/patient");
		}
		else{
			req.flash("success", "Profile Updated Successfully !!");
			res.redirect("/patient");
		}
	});
});

module.exports = router;