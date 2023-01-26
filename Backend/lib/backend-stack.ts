import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create a new Lambda function
    const myLambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda/code'),
      handler: 'index.handler',
    });

    // Create an API Gateway to trigger the Lambda function
    const myApi = new apigw.RestApi(this, 'MyApi', {
      restApiName: 'My API',
    });
    const myIntegration = new apigw.LambdaIntegration(myLambdaFunction);
    myApi.root.addMethod('POST', myIntegration);
  }
}