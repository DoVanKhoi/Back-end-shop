require('dotenv').config();
const express = require('express');
const router = express.Router();

router.get('/config', async (req, res) => {
    return res.status(200).json({
        status: 200,
        message: 'success',
        data: process.env.CLIENT_ID
    });
});

module.exports = router;