const mongoose = require("mongoose");

const {Schema} = mongoose;

const blogSchema = new Schema({
    title: {type: String, require: true},
    content: {type: String, require: true},
    photoPath: {type: String, require: true},
    author: {type: mongoose.SchemaTypes.ObjectId, ref: `User`}

},
    {timestamps : true}
)

// Model Name, Schema Name , The name with which we make colelction in the database
module.exports = mongoose.model('Blog', blogSchema, 'blogs')