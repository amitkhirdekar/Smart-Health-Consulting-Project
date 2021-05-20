var express         = require("express"),
    router          = express.Router({mergeParams:true}),
    Patient         = require("../models/patient"),
    Medical_Records = require("../models/med_records"),
    middleware      = require("../middleware")

//Add New Record
router.get("/new", middleware.isLoggedIn, function(req,res){
    Patient.findById(req.params.id , function(err, patient) {
		if(err){
			console.log(err);
		}
		else{
			res.render("MedicalRecords/new",{patient:patient});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req,res){
	Patient.findById(req.params.id, function(err, patient){
		if(err){
			console.log(err);
			res.redirect("/patient/")
		}
		else{
			var medRec = req.body.medRec;
			medRec.name = patient.name;

			Medical_Records.create(medRec, function(err, medRecord){
				if(err){
					console.log(err);
				}
				else{
					medRecord.save();
					patient.medical_record = medRecord;
					patient.save();
					res.redirect("/patient/" + req.params.id)
				}
			})
		}
	});
});


//Edit Medical Record
router.get("/:record_id/edit",middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
	Patient.findById(req.params.id).populate("medical_record").exec(function(err, foundPatient){
		res.render("./MedicalRecords/edit", {patient_id:req.params.id ,record:foundPatient.medical_record})
	});
});

//Update Medical Record
router.put("/:record_id", middleware.isLoggedIn, /*checkOwnership*/ function(req,res){
	Medical_Records.findByIdAndUpdate(req.params.record_id, req.body.medRec, function(err, updatedRecord){
		if(err){
			res.redirect("/patient");
		}
		else{
			req.flash("success", "Medical Record Updated Successfully !!")
			res.redirect("/patient/"+req.params.id);
		}
	});
});

//Delete Medical Record
router.delete("/:record_id",middleware.isLoggedIn,  function(req, res){
    //findByIdAndRemove
    Medical_Records.findByIdAndRemove(req.params.record_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Medical Record Deleted !!");
           res.redirect("/patient/" + req.params.id);
       }
    });
});

module.exports = router;

