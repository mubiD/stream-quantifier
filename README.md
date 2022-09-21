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

##### Enhancement Strat:

1. Include the usage of GraphQL
    - this will remove the need to filter through objProps
    - resulting in a leaner approach to passing data
    - which results in less computation time and throughput 

2. Increased modularity on Lambda fxns
    - instead of having one lambda do all of the 'lifting', we can separate the fxns to perform a single purpose only
    - this will increase performance 
    - this will lead to ease of debugging at scale

3. Elastic Load Balancers
    - by setting throughput thresholds, we can instantiate new instances vertically and increase capacity horizontally based on events

4. Read/Write Replicas:
    - we can decouple the different operations on the DB by having read-only replicas and write-only replicas 
    - relevant lambdas can then perform operations without worrying about throughput load 

5. SAM:
    - by using SAM we can automate testing on the lamdas

6. CloudWatch:
    - triggers, events and alerts can be linked up so that notifications relating to system heealth are delivered to admins

#### To Do:
1. Link apiGateway to Lambda
2. Add automated testing
3. Database seeding script
4. Provision the namespace where the response from Lambda can be stored

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

##### To Do:
    - accept params from client
        - event
        - user
    - pass params to lambda 
    - await response from lambda    

#### Lambda:
- This will hold the 'business' logic and will handle the computations
- it will consume the user object props and the event (play and stop) props
- it will then connect to the DB and search for the user.userID 
- it will then assess the value of the activeStreamCount 
- based on the value of the activeStreamCount, it will allow or deny the user to watch the content.
- if the user is allowed, lambda will then append the e.target.contentTitle to the contentTitles array and return the bool 'true' to ApiGateway, and lastly will increment the activeStreamCount by 1.
- if the user is denied, lambda will return false to ApiGateway

##### To Do:
    - link to apigateway (incoming and response)

#### Cloud watch:
- This is used to monitor the health of the Lambda via the AWS management console dashboard

##### To Do:
- set up alerts and configure monitoring dashboard

#### DynamoDB:
- This will hold the tables containing users and user info. 
- Such as:
    - userID (NUMBER) ==> PRIMARY_KEY
    - accName (STRING) ==> SORTING_KEY
    - activeStreamCount (NUMBER)
    - contentTitles (ARRAY)
- a DynamoDB Stream will be linked to the Lambda

##### To Do:
    
#### Deployment Instructions:
1. Ensure you are in the root directory of the project
2. Run 'npm install'
3. Navigate to bin/stream_quantifier_service.ts, and uncomment line 9.
4. Insert yout AWS credentials {account number and region of deployment}
5. Return to the root directory and run 'cdk bootstrap'
6. Once done, run 'cdk deploy'


