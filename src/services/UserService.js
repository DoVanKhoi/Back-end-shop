const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const { generalAccessToken, generalRefreshToken } = require('./JwtService');

const createNewUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword } = newUser;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email already exists'
                });
            } else if (password !== confirmPassword) {
                resolve({
                    status: 'ERR',
                    message: 'Password and confirm password is not match'
                });
            } else {
                let hashPassword = bcrypt.hashSync(password, salt);
                const createUser = await User.create({
                    name,
                    email,
                    password: hashPassword
                });
                if (createUser) {
                    resolve({
                        status: 'OK',
                        message: 'User created',
                        data: createUser
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    }
    )
};

const loginUserData = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                });
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);
            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Password is incorrect'
                });
            }

            const access_token = generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            const refresh_token = generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            });

            resolve({
                status: 'OK',
                message: 'Login success',
                access_token,
                refresh_token
            });
        } catch (e) {
            reject(e);
        }
    }
    )
};

const updateUserData = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                });
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

            resolve({
                status: 'OK',
                message: 'Update success',
                data: updatedUser
            });
        } catch (e) {
            reject(e);
        }
    })
};

const deleteUserData = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({ _id: id });

            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                });
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete user success'
            });
        } catch (e) {
            reject(e);
        }
    }
    )
};

const getAllUserData = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find();

            resolve({
                status: 'OK',
                message: 'Get all user success',
                data: allUser
            });
        } catch (e) {
            reject(e);
        }
    }
    )
};

const getUserById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ _id: id });

            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'User is not defined'
                });
            }

            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: user
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createNewUser,
    loginUserData,
    updateUserData,
    deleteUserData,
    getAllUserData,
    getUserById
}