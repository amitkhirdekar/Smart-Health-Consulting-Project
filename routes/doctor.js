var express 		  = require("express"),
	  router			  = express.Router(),
	  User			    = require("../models/user"),
	  middleware		= require("../middleware"),
	  passport		  = require("passport"),
    Patient			  = require("../models/patient"),
    Doctor        = require("../models/doctor"),
    nodemailer    = require('nodemailer'),
    generator     = require('generate-password'),
    Appointment   = require("../models/appointment")


router.get("/new", middleware.isLoggedIn, middleware.isAdmin, function(req,res){
    res.render("./doctor/new");
});

router.get("/", middleware.isLoggedIn, middleware.isDoctor, function(req,res){
  Doctor.findOne({'email' : req.user.username}, function(err, doc) {
		if(err){
			console.log(err);
		}
		else{
			res.render("./doctor/index",{doctor:doc, user:req});
		}
	});
});


router.get("/:id",middleware.isLoggedIn , function(req, res){
  Doctor.findById(req.params.id, function(err, doctor){
      if(err){
          console.log(err);
          return res.redirect("/patient");
      }
      res.render("./doctor/show", {doctor : doctor});
  });
});

router.post('/new', middleware.isLoggedIn, middleware.isAdmin, (req,res,next)=>{
  const { name, email, address, phone, degree, remark } = req.body;
  Doctor.find({ email: req.body.email })
  .exec()
  .then(doctors => {
    if (doctors.length >= 1) {
      req.flash("error", "Doctor with same email Id already registered")
      res.redirect('/new')
    } else {
          const doc = new Doctor({
            name,
            email,
            address,
            phone,
            degree,
            remark,
          });
          var pass = initialPassword()
          console.log(doc);
          doc
            .save()
            .then(result => {
              sendMail( 'Login credentials for Smart Health Project account.',
                        "Email Id:" + req.body.email + "\n" + "Password:" + pass + "\n You can reset your password on our website.",
                        email
                      )
            })
            .catch(err => {
              res.send(err)
            });
            const newUser = new User({
              name:name,
              username:email,
              role:2,
        });
        User.register(newUser, pass)
              .then(result => {
                console.log("New User has been registered")
              })
        res.redirect('/login')
      }
  });
});


router.get("/:id/edit",middleware.isLoggedIn, middleware.isDoctor, /*checkOwnership*/ function(req,res){
	Doctor.findById(req.params.id).exec(function(err, doctor){
		res.render("./doctor/edit", {doctor:doctor});
	});
});

router.put("/:id", middleware.isLoggedIn,middleware.isDoctor, /*checkOwnership*/ function(req,res){
	Doctor.findByIdAndUpdate(req.params.id, req.body.doctor , function(err, updatedDetails){
		if(err){
			res.redirect("/doctor");
		}
		else{
			req.flash("success", "Doctor Details Updated Successfully !!");
			res.redirect("/doctor/"+req.params.id);
		}
	});
});

router.get("/:id/appointment", function(req,res){
  User.findById(req.params.id, function(error, user ){
    if(error){
      console.log(err);
      return res.redirect("/doctor");
    }
    Doctor.findOne({email: user.username}, function(error1, doctor){
        if(error){
          console.log(error1);
          return res.redirect("/doctor");
        }
        Appointment.find({doctor:doctor._id}).populate("patient").populate("doctor").exec(function(err, allAppointments){
          if(err){
            req.flash("error", err.message);
            return res.redirect("/doctor");
          }
          var date = new Date(),
            addDate = new Date()
          date = date.setMinutes(date.getMinutes() - 30);
          addDate = addDate.setMinutes(addDate.getMinutes() + 30);
          var prevAppointment = [];
          var presAppointment = [];
          var futureAppointment = [];
          allAppointments.forEach(function(appointment){
              if(appointment.date.getTime() < date){
                  prevAppointment.push(appointment);
              }                
              else if(appointment.date.getTime() < addDate){
                  presAppointment.push(appointment);
              }
              else{
                  futureAppointment.push(appointment);
              }
          });
          prevAppointment.sort((a,b) => (a.date > b.date)? 1:-1);
          presAppointment.sort((a,b) => (a.date > b.date)? 1:-1);
          futureAppointment.sort((a,b) => (a.date > b.date)? 1:-1);
          res.render("./doctor/appointments", {prevAppointment:prevAppointment, presAppointment:presAppointment, futureAppointment:futureAppointment});
        });
      });
  });
});

router.delete("/:id",middleware.isLoggedIn, middleware.isAdmin,  function(req, res){
  Appointment.deleteMany({doctor:req.params.id}, function(err){
    if(err){
      console.log(err);
      req.flash("error",err.message );
      res.redirect("/admin");
    }
    Doctor.findByIdAndRemove(req.params.record_id, function(error){
      if(err){
          res.redirect("/admin");
      } else {
          req.flash("success", "Doctor Deleted !!");
          res.redirect("/admin/doctor");
      }
    });
  });
});

  



function sendMail(sub, msg, tomail){
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "smarthealthconsulting24.7@gmail.com",
      pass: "teproject123"  
    }
  });
  
  var mailOptions = {
    from: '"Smart Health Consulting Project" <smarthealthconsulting24.7@gmail.com>',
    to: tomail,
    subject: sub,
    html: msg
  };
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

function initialPassword(){
  var password = generator.generate({
    length: 10,
    numbers: true
});
  return password;
}

module.exports=router;