const {
    s3
} = require('../../config/dbs');
const package = require('../../config/packages');

module.exports.upload = (input, path) => {
    const uploadConfig = package.multer({
        storage: package.multerS3({ // Cấu hình để upload lên s3
            s3: s3,
            bucket: process.env.AWS_BUCKET_NAME,
            metadata: function (req, file, callback) { //Data được lưu lên s3
                callback(null, {
                    fieldName: file.fieldname
                });
            },
            key: function (req, file, callback) {
                const imageName = package.uuidv1();
                const fileName = path + imageName; // Tên file trên s3 (VD: collections/file)
                //! Lưu tên ảnh vào biến req.images, các name này sẽ được sử dụng ở các controllers khác
                if (!req.images) {
                    req.images = [imageName];
                } else {
                    let images = req.images;
                    images.push(imageName);
                    req.images = images;
                }
                //! =======================
                callback(null, fileName)
            }
        }),
        fileFilter: (req, file, callback) => { // Chỉ cho phép 1 số loại file được up lên
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                callback(null, true)
            } else {
                callback(null, false)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 5 // we are allowing only 5 MB files
        }
    });
    return uploadConfig.array(input, 50); //Tối đa 50 file được upload
}