import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create an S3 bucket to store the machine learning models
    const bucket = new s3.Bucket(this, 'FruitDetectionBucket');

    // Create the Lambda function
    const fruitFreshnessDetectionFunction = new lambda.Function(this, 'FruitFreshnessDetectionFunction', {
      code: lambda.Code.fromAsset('path/to/lambda/code'),
      handler: 'index.handler',
      runtime: lambda.Runtime.PYTHON_3_8,
      environment: {
        MODEL_BUCKET_NAME: bucket.bucketName,
        FRUIT_MODEL_KEY: 'path/to/fruit_detection_model',
        FRESHNESS_MODEL_KEY: 'path/to/freshness_detection_model'
      }
    });

    // Grant permissions to access the S3 bucket
    bucket.grantRead(fruitFreshnessDetectionFunction);

    // Add IAM permissions to allow the Lambda function to access S3
    fruitFreshnessDetectionFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['s3:GetObject'],
      resources: [bucket.bucketArn + '/*']
    }));

    // Create an API Gateway to trigger the Lambda function
    const myApi = new apigw.RestApi(this, 'MyApi', {
      restApiName: 'My API',
    });
    const myIntegration = new apigw.LambdaIntegration(fruitFreshnessDetectionFunction);
    myApi.root.addMethod('POST', myIntegration);
  }
}