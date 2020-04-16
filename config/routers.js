module.exports = (app) => {
    const routerAuth = require('../source/auth/routes');

    app.use('/auth', routerAuth);
}