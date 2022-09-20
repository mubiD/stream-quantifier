# Welcome to the StreamQuantifierService Application
This is a service that will be called when a user starts, or stops, any content on our streaming platform. It will check whether the request to start watching is valid, and either allow or deny the request. Also, it will check whether the user has stopped watching, and will update the database accordingly. 

## Development Assertions and Assumptions:
- The user authorization and authentication, video content, central database schema, and all other adjascent services are assumed to be handled by other services. Thereby, following a micro-services architecture model.
- This version of this service is intended as a minimum viable product.
- Notes on the possible scalability, performance, security and resillience enhancements will be found below. 

## Architecture:
- this service is built on the micro-services architecture model.
- it's core components is comprised of:
    - AWS ApiGateway
    - AWS Lambda
    - AWS DynamoDB
- it's built using code as infrastructure by using AWS CDK V1, which leverages AWS CloudFormation
- A central, unified stack will be used for ease of deployment
- A combination of Node.js and Typescript is used to define resources, while GitHub is the version control system of choice
- CloudWatch will be used as the monitoring and logging tool

### Here's how the service works:
#### ApiGateway:
- This will expose the service and serve as an entry point so as to be consumed by any client
- It will facilitate ANY method: ['GET', 'POST', 'DELETE', 'PUT'] 
    - The GET method will pass the Play event object and the user object
    - the user object will pass user.userID to be consumed by Lamda, which will inform it where to look in the DynamoDB
    - the event object, of which there will be two types (onClick to play, and the stopping of the content(NB! not pause, only stopping)), will pass the event.target.contentTitle to be consumed by lamda for processing 
- These objects and their properties will be filtered so that only relevant object porperties will be passed to the Lambda 
    - user.userID
    - onClick play event will pass e.target.contentTitle (among others)
    - onClick stop event will pass e.target.contentTitle (among others)

#### Lambda:
- This will hold the 'business' logic and will handle the computations
- it will consume the user object props and the event (play and stop) props
- it will then connect to the DB and search for the user.userID 
- it will then assess the value of the activeStreamCount 
- based on the value of the activeStreamCount, it will allow or deny the user to watch the content.
- if the user is allowed, lambda will then append the e.target.contentTitle to the contentTitles array and return the bool 'true' to ApiGateway, and lastly will increment the activeStreamCount by 1.
- if the user is denied, lambda will return false to ApiGateway

#### DynamoDB:
- This will hold the tables containing users and user info. 
- Such as:
    - userID (NUMBER) ==> PRIMARY_KEY
    - accName (STRING) ==> SORTING_KEY
    - activeStreamCount (NUMBER)
    - contentTitles (ARRAY)
    
## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

The `cdk.json` file tells the CDK Toolkit how to execute your app.

