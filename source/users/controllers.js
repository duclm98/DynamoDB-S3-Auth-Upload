const package = require('../../config/packages');

exports.profile = async (req, res, next) => {
    return res.send(req.user);
};