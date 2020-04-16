const package = require('../../config/packages');
const controller = require('./controllers');

const router = package.express.Router();

router.post('/register', controller.register); //username, password
router.post('/login', controller.login); //username, password
router.post('/refresh', controller.refreshToken); // refreshToken

module.exports = router;