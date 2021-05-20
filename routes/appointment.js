const User = require("../models/user");
const { all } = require("./patient");

var express     = require("express"),
    router      = express.Router({mergeParams:true}),
    Appointment = require("../models/appointment"),
    Patient     = require("../models/patient"),
    Doctor      = require("../models/doctor"),
    middleware  = require("../middleware")


//new Appointment
router.get("/new", middleware.isLoggedIn, function(req,res){
    Doctor.find({}, function(err, allDoctors){
        if(err){
            return res.render("/patient");
        }
        res.render("./appointment/new", {patient_id : req.params.id, doctors:allDoctors});
    });
});    

router.get("/new/:doctor_id", function(req, res){
    User.findById(req.params.id, function(err, user){
        if(err){
            console.log(err);
            return res.redirect("./patient");
        }
        Patient.findOne({email:user.username}, function(error, patient){
            if(error){
            console.log(err);
            return res.redirect("./patient"); 
            }
            Doctor.findById(req.params.doctor_id, function(err1, doctor){
                if(err){
                    req.flash("error", err1.message);
                    return res.redirect("/patient");
                }
                res.render("./appointment/doctor", {doctor:doctor, patient_id : patient._id});
            });
        });
    });
});


router.post("/", middleware.isLoggedIn, function(req,res){
    Appointment.find({date:req.body.time}, function(err, appointment){
        if(err){
            console.log(err);
            return res.redirect('/patient');
        }
        if(appointment.length > 0){

            req.flash("error", "This appointment slot is booked. Please try another");
            return res.redirect('/patient');
        }
        Doctor.findOne({name:req.body.name}, function(error,doctor){
            if(error){
                console.log(error);
                req.flash("error", "Doctor not found");
                return res.redirect("/patient");
            }
            var newAppointment = new Appointment({patient:req.params.id, doctor:doctor._id , date : req.body.time, description : req.body.description})
            newAppointment.save();
            req.flash("success", "Appointment Booked Successfully");
            res.redirect("/index");
        });
    });
});


//all Appointments
router.get("/", middleware.isLoggedIn, function(req, res){
    Appointment.find({patient:req.params.id}).populate("doctor").populate("patient").exec(function(err, allAppointments){
        if(err){
            console.log(err);
            return res.redirect("/patient");
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
        res.render("./appointment/view", {prevAppointment:prevAppointment, presAppointment:presAppointment, futureAppointment:futureAppointment});
    });
});




//Update Appointment
router.get("/:app_id/edit", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
	Appointment.findById(req.params.app_id).populate("doctor").populate("patient").exec(function(err, foundAppointment){
		res.render("./appointment/edit", {patient_id:req.params.id ,appointment:foundAppointment});
	});
});


router.put("/:app_id", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
    Doctor.findOne({name:req.body.appointment.doctor}, function(err, doctor){
        if(err){
            console.log(err);
            req.flash("error", "Doctor Not Found");
            return res.redirect("/patient")
        }

        var newAppointment = {patient : req.params.id, doctor : doctor._id, date : req.body.appointment.time, description : req.body.appointment.description};
        Appointment.findByIdAndUpdate(req.params.app_id, newAppointment, function(error, updatedAppointment){
            console.log(req.params.app_id, newAppointment);
            if(err){
                console.log(error);
                res.redirect("/patient");
            }
            else{
                req.flash("success", "Appointment Updated Successfully !!");
                if(req.user.role === 2){
                    return res.redirect("/doctor");
                }
                res.redirect("/patient/"+req.params.id+"/appointment");
            }
        });
    });
});

//Delete Appointment
router.delete("/:app_id",middleware.isLoggedIn,  function(req, res){
    //findByIdAndRemove
    Appointment.findByIdAndRemove(req.params.app_id, function(err){
       if(err){
           return res.redirect("/patient/"+ req.params.id );
       } 
       else {
           req.flash("success", "Appointment Deleted !!");
           if(req.user.role === 2){
               return res.redirect("/doctor");
           }
           res.redirect("/patient/" + req.params.id + "/appointment");
       }
    });
});

module.exports = router;