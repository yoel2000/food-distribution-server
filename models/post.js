var mongoose = require('mongoose');

// define the schema for our user model
var postSchema = new mongoose.Schema({ 
    body: String,
    comments:[String]
 },{timestamps: true });
module.exports = mongoose.model('Post', postSchema);
