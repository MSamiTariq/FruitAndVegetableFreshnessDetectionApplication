import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import updateFruit from './updateFruit';
import getFruit from './getFruit';


exports.handler = async (event: any) => {
  switch (event.httpMethod) {
    case "GET":
      return await getFruit();
    case "POST":
      return await updateFruit(event.body.fruitName);
    default:
      return null;
  }
};