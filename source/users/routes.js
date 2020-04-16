const package = require('../../config/packages');
const middleware = require('../../config/middleware');
const controller = require('./controllers');

const router = package.express.Router();
const isAuth = middleware.middlewareAuth.isAuth;

router.get('/profile', isAuth, controller.profile);

module.exports = router;