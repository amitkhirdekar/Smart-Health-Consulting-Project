var mongoose = require("mongoose");

var appointmentSchema = new mongoose.Schema({
    patient:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    doctor:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Doctor",
        required : true
    },

    date : Date,

    description : 'String'

	
});



module.exports = mongoose.model("Appointment", appointmentSchema);