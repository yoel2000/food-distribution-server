var mongoose = require('mongoose');

// define the schema for our user model
var distributionSchema = mongoose.Schema({
        date: Date,
        city:String,
        address: String,
        productIds: [{prodId:String,amount:Number}],
        distributorId: String,
        isComplete:Boolean,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('distribution', distributionSchema);
