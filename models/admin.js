var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema({
	name : {
		type:String
	},
	email : {
        type        : String,
        required    : true,
        unique      : true
    }
});



module.exports = mongoose.model("Admin", adminSchema);
