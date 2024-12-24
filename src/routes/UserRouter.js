const express = require('express');
const router = express.Router();
const { createUser, loginUser, logoutUser, updateUser,
    deleteUser, getAllUser, getDetailUser, refreshToken } = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require('../middleware/authMiddleware');


router.post('/sign-up', createUser);
router.post('/sign-in', loginUser);
router.post('/log-out', logoutUser);
router.put('/update-user/:id', authUserMiddleware, updateUser);
router.delete('/delete-user/:id', authMiddleware, deleteUser);
router.get('/getAll', authMiddleware, getAllUser)
router.get('/getDetails/:id', authUserMiddleware, getDetailUser)
router.post('/refresh-token', refreshToken);

module.exports = router;