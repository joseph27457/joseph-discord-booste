const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    userId: String,
    credit: Number
});
module.exports = mongoose.model('User', UserSchema);