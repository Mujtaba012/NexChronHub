const mongoose = require("mongoose");

const {Schema} = mongoose;

const tokenSchema = new Schema({
    token: {type: String, require: true},
    userId: {type: mongoose.SchemaTypes.ObjectId, ref:'User'}
},
    {timestamps: true}
)
module.exports = mongoose.model('RefreshToken', tokenSchema, 'tokens')