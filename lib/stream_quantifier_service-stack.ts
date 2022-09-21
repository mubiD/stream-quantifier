import * as cdk from '@aws-cdk/core';
import * as dynamoDB from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ApiGateway from '@aws-cdk/aws-apigateway';
import { RemovalPolicy } from '@aws-cdk/core';

export class StreamQuantifierServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  // the DynamoDB table that will hold:
  // table of users
  // each user will have:
    // an accountName (string)
    // userID (string)
    // activeStreamCount (number)
    // contentTitles (array)

    const myTable = new dynamoDB.Table(this, 'DynamoDbTable', {
      partitionKey: {
        name: 'userID',
        type: dynamoDB.AttributeType.NUMBER
      },
      sortKey: {
        name: 'accName',
        type: dynamoDB.AttributeType.STRING
      },
      // replicationRegions: ['us-east-2', 'us-west-2'],
      // removalPolicy: RemovalPolicy.DESTROY,
      // readCapacity: 2,
      // writeCapacity: 2,
      // tableClass: dynamoDB.TableClass.STANDARD_INFREQUENT_ACCESS,
    });

    // lambda start here

    // this lambda will read from DynamoDB to:
      // check value of activeStreamCount
      // either allow or deny user request
      // increment activeStreamCount by 1 on success
      // append event.contentTitle to contentTitles array

    const LambdaOne = new lambda.Function(this, 'LambdaOne',{
      code: new lambda.AssetCode('resources'),
      handler: 'Lambdas.LambdaOneHandler',
      runtime: lambda.Runtime.NODEJS_16_X,
      environment:{
        TABLE_NAME: myTable.tableName,
        PRIMARY_KEY: 'userID'
      }      
    });

    // allowing lambda read and write access to dynamoDB table > myTable
    myTable.grantReadWriteData(LambdaOne);

    // apigateway starts here

  const myApiGateway = new ApiGateway.LambdaRestApi(this, '/', {
      description: 'The api layer that exposes the service to be consumed by any client',
      handler: LambdaOne,
      deploy: true,
      proxy: false,
      deployOptions:{
        stageName: 'dev'
        },
        defaultCorsPreflightOptions: {
         allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          ],
          allowMethods: ['ANY'],
          allowCredentials: true,
          allowOrigins: ['http://localhost:3000']
        }, 
    });

    // adding the root directory 
    const myApiGatewayRoot = myApiGateway.root.addResource('root');

    // intergrating LambdaOne
    // will return the response to apiGateway
    const LambdaOneApi = new ApiGateway.LambdaIntegration(LambdaOne);
    

    // adding method of 'ANY' to the root 
    myApiGatewayRoot.addMethod('ANY', LambdaOneApi);

  }

  
}



