const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

export default async function getBookmarks() {
    const params = {
        TableName: process.env.TABLE_NAME,
    };

    try {
        const data = await docClient.scan(params).promise();
        return data.Items;
    } catch (err) {
        console.log(err);
        return null;
    }
}