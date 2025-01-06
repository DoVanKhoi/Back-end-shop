require('dotenv').config();
const mongoose = require('mongoose');

// connect to MongoDB
let connectDB = async () => {
    await mongoose.connect(process.env.MONGO_DB)
        .then(() => {
            // console.log('Connected to MongoDB');
        })
        .catch((err) => {
            console.error(err);
        });
}

module.exports = connectDB;