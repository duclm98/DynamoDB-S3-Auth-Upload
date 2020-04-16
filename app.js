const package = require('./config/packages');
const model = require('./config/models');
require('express-async-errors');

//Authentication with jwt
let opts = {};
opts.jwtFromRequest = package.ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.ACCESS_TOKEN_SECRET || 'access-token-secret-example';
package.passport.use('jwt', new package.JwtStrategy(opts, async function (jwt_payload, done) {
  const user = await model.modelUser.getUser(jwt_payload.payload.username);
  if (!user) {
    return done(null, false);
  }
  // Trả lại về hàm ./source/auth/middleware/isAuth();
  return done(null, user);
}));
//==================================================

const app = package.express();

// ========== Configure CORS ==========
app.use(package.cors({
  origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  credentials: true,
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token", "Authorization"],
  methods: "GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS"
}));
// ====================================

app.use(package.logger('dev'));
app.use(package.express.json());
app.use(package.express.urlencoded({
  extended: false
}));
app.use(package.cookieParser());
app.use(package.bodyParser());

// ========== Router ==========
const router = require('./config/routers');
router(app);
// ============================

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.redirect('/');
  // res.status(404).send('NOT FOUND');
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Send the error
  console.log(err.stack);
  res.status(err.status || 500).send(err.message);
});

module.exports = app;