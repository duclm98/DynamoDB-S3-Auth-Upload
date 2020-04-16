const package = require('../../config/packages');

exports.generateToken = async (payload, secretSignature, tokenLife, accessToken) => {
    // Thực hiện ký và tạo token
    package.jwt.sign({
            payload
        },
        secretSignature, {
            algorithm: "HS256",
            expiresIn: tokenLife,
        },
        (error, token) => {
            if (error) {
                console.log(`Lỗi tạo token: ${error}`);
                return accessToken(false);
            }
            return accessToken(token);
        });
}

exports.verifyToken = async (token, secretKey, fn) => {
    package.jwt.verify(token, secretKey, (error, decoded) => {
        if (error) {
            console.log("Sai token" + error);
            return fn(false);
        }
        fn(decoded);
    });
}