const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient();

export default async function updateFruit(fruitName: any) {

  try {
    const result = await docClient.update({
      TableName: process.env.TABLE_NAME,
      Key: { fruitName },
      UpdateExpression: 'SET quantity = quantity + :increment',
      ExpressionAttributeValues: {
        ':increment': 1,
      },
      ReturnValues: 'UPDATED_NEW',
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: 'Internal Server Error',
    };
  }
}