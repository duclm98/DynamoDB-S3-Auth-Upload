const model = require('../../config/models');
const package = require('../../config/packages');
const method = require('../../config/methods');
const variable = require('../../config/variables');

exports.register = async (req, res, next) => {
    if (!req.body.username || !req.body.password) {
        return res.status(205).send('Username or password is not empty.');
    }
    const username = (req.body.username).toLowerCase();
    const user = await model.modelUser.getUser(username);
    if (user)
        return res.status(409).send('Username is already existed.');
    const hashPassword = package.bcrypt.hashSync(req.body.password, variable.SALT_ROUNDS);
    const newUser = {
        username: username,
        password: hashPassword
    }
    const createUser = await model.modelUser.createUser(newUser);
    if (!createUser) {
        return res.status(202).send('Creating account is failed.');
    }
    // Chuyển qua controller đăng nhập
    this.login(req, res);
};

//username, password
exports.login = async (req, res) => {
    let username = req.body.username || 'test';
    const password = req.body.password || '12345';
    username = username.toLowerCase();
    const user = await model.modelUser.getUser(username);
    if (!user) {
        return res.status(401).send("Incorrect username or password.");
    }
    const isPasswordValid = await model.modelUser.validPassword(username, password);
    if (!isPasswordValid) {
        return res.status(401).send("Incorrect username or password.");
    }

    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || variable.auth.accessTokenLife;
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || variable.auth.accessTokenSecret;

    const dataForAccessToken = {
        username: user.username
    };
    await method.methodAuth.generateToken(dataForAccessToken, accessTokenSecret, accessTokenLife, async (accessToken) => {
        if (accessToken === false) {
            return res.status(401).send('Logging in is failed, please try again later.');
        }
        let refreshToken = package.randToken.generate(variable.auth.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
        if (!user.refreshToken) { // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
            await model.modelUser.updateRefreshToken(user.username, refreshToken);
        } else { // Nếu user này đã có refresh token thì lấy refresh token đó từ database
            refreshToken = user.refreshToken;
        }

        return res.json({
            mesage: "Logging in is successful.",
            accessToken,
            refreshToken
        });
    });
}

// refreshToken
exports.refreshToken = async (req, res) => {
    // Lấy refresh token từ body
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        return res.status(205).send('Refresh token not found.');
    }
    // =========================

    // Lấy access token từ header
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(205).send('Access token not found.');
    }
    const accessToken = authorizationHeader.split(' ')[1];
    // =========================

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || variable.auth.accessTokenSecret;
    const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || variable.auth.accessTokenLife;

    // Decode access token đó
    package.jwt.verify(accessToken, accessTokenSecret, {
        ignoreExpiration: true
    }, async function (err, token) {
        const username = token.payload.username; // Lấy username từ payload

        // Kiểm tra refresh token có hợp lệ không (giống như token được lưu trong database)
        const verifyRefreshToken = await model.modelUser.verifyRefreshToken(username, refreshToken);
        if (verifyRefreshToken === false) {
            return res.status(400).send('Invalid refresh token.');
        }

        // Tạo access token mới
        const dataForAccessToken = {
            username
        };
        await method.methodAuth.generateToken(dataForAccessToken, accessTokenSecret, accessTokenLife, async (accessToken) => {
            if (accessToken === false) {
                return res.status(401).send('Generating refresh token is failed, please try again later.');
            }
            return res.status(200).json({
                accessToken
            })
        });
    })
};