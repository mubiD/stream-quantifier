import * as cdk from '@aws-cdk/core';
import * as dynamoDB from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ApiGateway from '@aws-cdk/aws-apigateway';
import { RemovalPolicy } from 'aws-cdk-lib';

export class StreamQuantifierServiceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

  // the DynamoDB table that will hold:
  // table of users
  // each user will have:
    // an accountName/userID (string)
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
      replicationRegions: ['us-east-1', 'us-east-2', 'us-west-2'],
      removalPolicy: RemovalPolicy.DESTROY,
      readCapacity: 20,
      writeCapacity: 20,
      tableClass: dynamoDB.TableClass.STANDARD_INFREQUENT_ACCESS,
      billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST
    })

    // lambdas start here

    // this lambda will read from DynamoDB to check value of activeStreamCount
    const LambdaOne = new lambda.Function(this, 'LambdaOne',{
      code: new lambda.AssetCode('resources'),
      handler: 'Lambdas.LambdaOneHandler',
      runtime: lambda.Runtime.NODEJS_16_X,
      
      // see lambda file for more info
      
    });

    // allowing lambda read and write access to dynamoDB table > myTable
    myTable.grantReadWriteData(LambdaOne);

    // apigateway starts here

    // this API will expect two objects: (event, user)
    // this API will have two methods: ( GET, PUT )
    // it will pass the event, and user to lambda 

  const myApiGateway = new ApiGateway.LambdaRestApi(this, '/', {
      description: 'The api layer that exposes the service to be consumed by any client',
      handler: LambdaOne,
      deploy: true,
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
          allowMethods: ['GET', 'PUT'],
          allowCredentials: true,
          allowOrigins: ['http://localhost:3000']
        }, 
    })

    myApiGateway.root.addMethod('GET');
    myApiGateway.root.addMethod('PUT');


    new cdk.CfnOutput(this, '/', {
     value: myApiGateway.url
    });
    
  }

}



