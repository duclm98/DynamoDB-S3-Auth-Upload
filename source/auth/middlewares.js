const package = require('../../config/packages');
const method = require('./methods');

//! Cách thủ công
// exports.isAuth = async (req, res, next) => {
//     // Lấy token được gửi lên từ phía client, thông thường tốt nhất là các bạn nên truyền token vào header
//     const tokenFromClient = req.body.token || req.query.token || req.headers['x-access-token'];
//     if (tokenFromClient) {
//         // Nếu tồn tại token
//         try {
//             // Thực hiện giải mã token xem có hợp lệ hay không?
//             const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-example';
//             await method.verifyToken(tokenFromClient, accessTokenSecret, (jwt) => {
//                 if (jwt === false) {
//                     return res.status(401).json('Bạn phải đăng nhập trước.');
//                 }
//                 // Nếu token hợp lệ, lưu thông tin giải mã được vào đối tượng req, dùng cho các xử lý ở phía sau.
//                 return req.user = jwt.user;
//             });
//             // Cho phép req đi tiếp sang controller.
//             next();
//         } catch (error) {
//             // Nếu giải mã gặp lỗi: Không đúng, hết hạn...etc:
//             console.log("Error while verify token:", error);
//             return res.status(401).json('Bạn phải đăng nhập trước.');
//         }
//     } else {
//         // Không tìm thấy token trong request
//         return res.status(403).send('Không có token nào được cung cấp.');
//     }
// }

//! Cách dùng passportJS
exports.isAuth = async (req, res, next) => {
    package.passport.authenticate('jwt', {
        session: false
    }, (err, user, info) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Đã xảy ra lỗi, vui lòng thử lại.');
        }
        if (info !== undefined) {
            console.log(info.message);
            return res.status(401).send('Thông tin đăng nhập không chính xác.');
        } else {
            //Lưu thông tin user vào req.user
            req.user = user;

            //Qua controller tiếp theo
            return next();
        }
    })(req, res, next);
}