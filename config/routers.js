module.exports = (app) => {
    const routerAuth = require('../source/auth/routes');
    const routerUser = require('../source/users/routes');

    app.use('/auth', routerAuth);
    app.use('/users', routerUser);
}