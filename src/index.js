require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const connectDB = require('./config/connectDB');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// config cors and cookie
app.use(cors());
app.use(cookieParser());

// config request body data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const port = process.env.PORT || 8080;      // port to listen on
const hostname = process.env.HOSTNAME; // hostname to listen on

// connect to MongoDB
connectDB();

//router
routes(app);

app.listen(port, hostname, () => {
    console.log(`Example app listening on port ${port}`)
})