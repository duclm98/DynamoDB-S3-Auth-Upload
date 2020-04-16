const AWS = require('aws-sdk');
const promisify= require('util').promisify;
const awsConfig = {
    "region": process.env.REGION,
    "accessKeyId": process.env.ACCESS_KEY_ID,
    "secretAccessKey": process.env.SECRET_ACCESS_KEY,
    "signatureVersion": 'v4'
};
AWS.config.update(awsConfig);

const docClient = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const scan = promisify(docClient.scan).bind(docClient);
const query = promisify(docClient.query).bind(docClient);
const get = promisify(docClient.get).bind(docClient);
const put = promisify(docClient.put).bind(docClient);
const update = promisify(docClient.update).bind(docClient);
const del = promisify(docClient.delete).bind(docClient);
const transactGet = promisify(docClient.transactGet).bind(docClient);
const transactWrite = promisify(docClient.transactWrite).bind(docClient);

module.exports = {
    docClient,
    s3,
    scan,
    query,
    get,
    put,
    update,
    del,
    transactGet,
    transactWrite
}