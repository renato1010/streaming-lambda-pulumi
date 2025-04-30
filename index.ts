import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import * as awsNative from '@pulumi/aws-native';

// Create an IAM role for the Lambda function
const lambdaRole = new aws.iam.Role('lambdaRole', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(aws.iam.Principals.LambdaPrincipal),
  managedPolicyArns: [aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole]
});

// Create a Lambda function
const streamingFunction = new aws.lambda.Function('streamingFunction', {
  role: lambdaRole.arn,
  handler: 'dist/index.handler',
  runtime: aws.lambda.Runtime.NodeJS22dX,
  code: new pulumi.asset.AssetArchive({
    node_modules: new pulumi.asset.FileArchive('./lambda/node_modules'),
    dist: new pulumi.asset.FileArchive('./lambda/dist')
  }),
  timeout: 30,
  memorySize: 256
});

// Lambda function  permission to be invoked by  any
new aws.lambda.Permission('streaming-permission', {
  action: 'lambda:InvokeFunctionUrl',
  "function": streamingFunction.arn,
  principal: '*',
  functionUrlAuthType: 'NONE'
});

// Streaming URL
const streamingUrl = new awsNative.lambda.Url('streaming-url', {
  authType: 'NONE',
  targetFunctionArn: streamingFunction.arn,
  invokeMode: 'RESPONSE_STREAM'
});

export const streamingURL = streamingUrl.functionUrl;
