import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import {Role, ServicePrincipal, PolicyStatement, Effect,} from 'aws-cdk-lib/aws-iam';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendNewStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    cdk.aws_iam.Role
    const role = new Role(this, "LambdaRole", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
    });
    ///Attaching ses access to policy
    const policy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ["ses:SendEmail", "ses:SendRawEmail", "sns:*", "logs:*"],
      resources: ["*"],
    });
    //granting IAM permissions to role
    role.addToPolicy(policy);

    // Table to store fruit's information
    const table = new dynamodb.Table(this, "fruitsTable", {
      partitionKey: {
        name: "fruitName",
        type: dynamodb.AttributeType.STRING,
      },
    });

    // Send Email lambda
    const sendEmailFunction = new lambda.Function(this, 'SendEmailFunction', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'sendEmail.handler',
      runtime: lambda.Runtime.NODEJS_16_X, 
      role: role,
    })

    // Create an API Gateway to trigger the Lambda function
    const sendEmailAPI = new apigw.RestApi(this, 'emailAPI', {
      restApiName: 'Email API',
    });
    const integ = new apigw.LambdaIntegration(sendEmailFunction);
    sendEmailAPI.root.addMethod("POST", integ);

    // Get fruit quantity lambda
    const fruitDBLambda = new lambda.Function(this, 'FruitQuantityFunction', {
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        TABLE_NAME: table.tableName
      }
    });

    //Grant permissions to access the table
    table.grantFullAccess(fruitDBLambda)

    // Create an API Gateway to get the quantity of each fruit
    const fruitAPI = new apigw.RestApi(this, 'getQuantity', {
      restApiName: 'Fruit_API',
    });
    const integration = new apigw.LambdaIntegration(fruitDBLambda);
    fruitAPI.root.addMethod('GET', integration);
    fruitAPI.root.addMethod('POST', integration);
  }
}