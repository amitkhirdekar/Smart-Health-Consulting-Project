const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    degree: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: Number
        // required: true,
    },
    remark: {
        type: String,
    },

});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;