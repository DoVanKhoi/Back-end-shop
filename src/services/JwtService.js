require('dotenv').config();
const jwt = require('jsonwebtoken');

const generalAccessToken = (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '1h' });
    return access_token;
}

const generalRefreshToken = (payload) => {
    const access_token = jwt.sign({
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' });
    return access_token;
}

const refreshTokenService = (token) => {
    return new Promise((resolve, reject) => {
        try {
            jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
                if (err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authentication'
                    });
                }

                const access_token = generalAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                });
                resolve({
                    status: 'OK',
                    message: 'Refresh token success',
                    access_token
                });
            });
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    generalAccessToken,
    generalRefreshToken,
    refreshTokenService
};