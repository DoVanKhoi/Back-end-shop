const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, required: true, default: false },
        phone: { type: Number },
        address: { type: String },
        city: { type: String },
        avatar: { type: String },
    },
    {
        timestamps: true
    }
);
const User = mongoose.model('User', userSchema);
module.exports = User;