var mongoose = require('mongoose');

// define the schema for our user model
var messageSchema = mongoose.Schema({
        from: String,
        to: String,
        text: String

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);