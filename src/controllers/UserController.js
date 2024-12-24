const { createNewUser, loginUserData, updateUserData, deleteUserData,
    getAllUserData, getUserById } = require('../services/UserService');
const { refreshTokenService } = require('../services/JwtService');

const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isCheckEmail = reg.test(email);
        const reg_password = /^(?=.*[A-Za-z])(?=.*\d)(?!.*\W)[A-Za-z\d]{6,}$/;
        const isCheckPassword = reg_password.test(password);

        if (!name || !email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email is invalid'
            });
        } else if (!isCheckPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Password must contain at least 8 characters, including a number and no special characters'
            });
        }

        const response = await createNewUser(req.body);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        const isCheckEmail = reg.test(email);

        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'All fields are required'
            });
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Email is invalid'
            });
        }

        const response = await loginUserData(req.body);
        const { refresh_token, ...newResponse } = response;

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        }
        )

        return res.status(200).json(newResponse);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const data = req.body;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            });
        }

        const response = await updateUserData(userId, data);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            });
        }

        const response = await deleteUserData(userId);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await getAllUserData();

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'User ID is required'
            });
        }

        const response = await getUserById(userId);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token;

        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The refresh_token is required'
            });
        }

        const response = await refreshTokenService(token);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');

        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        });
    } catch (e) {
        return res.status(404).send(e.message);
    }
}

module.exports = {
    createUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken
}