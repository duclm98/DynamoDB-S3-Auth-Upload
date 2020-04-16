const package = require('../../config/packages');
const middleware = require('../../config/middleware');
const method = require('../../config/methods');
const router = package.express.Router();
const controller = require('./controllers');

router.post('/register', controller.register); //username, password
router.post('/login', controller.login); //username, password
router.post('/refresh', controller.refreshToken); // refreshToken

module.exports = router;