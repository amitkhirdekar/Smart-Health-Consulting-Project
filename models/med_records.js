var mongoose = require("mongoose");

var medRecSchema = new mongoose.Schema({
    name : 'String',
    age : 'Number',
    gender : 'String',
    height : 'Number',
    weight : 'Number',
    blood_group : 'String',
    sugar : 'Number',
    bp : 'Number'

});

module.exports = mongoose.model("Medical_Records" , medRecSchema);

