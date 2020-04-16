const db = require('../../config/dbs');
const package = require('../../config/packages');
const TABLENAME = "users";

exports.getUser = async (username) => {
    const params = {
        TableName: TABLENAME,
        Key: {
            "username": username
        }
    };
    try {
        const data = await db.get(params);
        return data.Item;
    } catch {
        return null;
    }
};

exports.validPassword = async function (username, password) {
    const user = await this.getUser(username);
    if (!user) {
        return false;
    }
    if (!user.password) {
        return false;
    }
    return await package.bcrypt.compare(password, user.password);
};

exports.verifyRefreshToken = async function (username, refreshToken) {
    const user = await this.getUser(username);
    if (!user) {
        return false;
    }
    if (user.refreshToken !== refreshToken) {
        return false;
    }
    return true;
}

exports.createUser = async (user) => {
    const params = {
        TableName: TABLENAME,
        Item: user
    };
    try {
        const create = await db.put(params);
        console.log(create);
        return true;
    } catch {
        return false;
    }
}

exports.updateRefreshToken = async (username, refreshToken) => {
    const params = {
        TableName: TABLENAME,
        Key: {
            "username": username
        },
        UpdateExpression: "set refreshToken = :rT",
        ExpressionAttributeValues: {
            ":rT": refreshToken
        },
        ReturnValues: "UPDATED_NEW"
    };
    try {
        const update = await db.update(params);
        console.log(update);
        return true;
    } catch {
        return false;
    }
}