const mongoose = require('mongoose');
const CodeSchema = new mongoose.Schema({
    code: String,
    amount: Number,
    used: { type: Boolean, default: false }
});
module.exports = mongoose.model('Code', CodeSchema);