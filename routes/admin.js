const express    = require('express');
const router     = express.Router();
const Doctor     = require('../models/doctor');
const User       = require('../models/user.js');
const mongoose   = require('mongoose');
const nodemailer = require('nodemailer');
var   generator  = require('generate-password');
var   middleware = require("../middleware");
const Admin      = require("../models/admin");
const Patient	 = require("../models/patient");
const Appointment = require('../models/appointment');

router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
  res.render("./admin/index");
});
router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
  res.render("./admin/new");
});

router.get("/", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
  res.render("./admin/index")
});

router.post("/", middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	var newAdmin = new Admin({name:req.body.name, email:req.body.email}) ;
	newAdmin.save();
	var newUser = new User({name : req.body.name, username : req.body.email, role:0});
	
	
	User.register(newUser,  req.body.password, function(err, user){
		if(err){
			console.log(err.message);
			req.flash('error', err.message);
			return res.redirect("/admin/new");
    }
    req.flash("success", "New Admin Registered Successfully ! !");
		res.redirect("/admin");
	});
});

router.get('/admin', middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Admin.find({}, function(err, allAdmin){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/admin');
		}
		res.render('./admin/view', {users:allAdmin, heading:"View All Admins"});
	});
});

router.get('/patient', middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Patient.find({}, function(err, allPatient){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/admin');
		}
		res.render('./admin/view', {users:allPatient, heading:"View All Patients"});
	});
});

router.get('/doctor', middleware.isLoggedIn, middleware.isAdmin, function(req, res){
	Doctor.find({}, function(err, allDoctor){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect('/admin');
		}
		res.render('./admin/view', {users:allDoctor, heading:"View All Doctors"});
	});
});

router.get('/appointment', middleware.isLoggedIn, middleware.isAdmin, function(req,res){
	Appointment.find({}).populate("doctor").populate("patient").exec(function(err, allAppointments){
		if(err){
			console.log(err);
			req.flash("error", err.message);
			return res.redirect("/admin");
		}
		res.render("./admin/appointments", {appointments : allAppointments});
	});
});


	
module.exports = router;

