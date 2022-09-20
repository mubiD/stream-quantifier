const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

// this lambda will expect two objects as params(e, user)
// it will then connect to DynamoDB and check the activeStreamCount value of the relevant userID
// if contentTitlesArray.Length >=2, it will return false
// if contentTitlesArray.Length <2, it will return true

export function LambdaOneHandler(e, user){

    // checking if the two objects are being passed successfully
    // console.log(user);
    // console.log(e);
    
    // checking if the objects passed are actually objects and then parsing them 
    const eventBody = typeof e.body == 'object' ? e.body: JSON.parse(e.body);
    const userBody = typeof user.body == 'object' ? user.body: JSON.parse(user.body)

    // DB connection/reading happens here
    checkingDb = (userBody, eventBody) => {
        if(eventBody == 'object' && userBody == 'object'){

            await.db.any(userBody, eventBody).promise();

            //find a way for lambda to query and validate the params passed with the content of the table

            return {statusCode: 200, body: {userBody, eventBody}};
        }
        if (err){
            return {statusCode: 500, body: JSON.stringify(err)};
        }
    };

    checkingDb(userBody, eventBody);
    
    // lambda then finds the user by user.userID in the DB
    // lambda then checks the value of activeStreamCount    

    // this is test data used to fire the lambda via the myApiGateway
    // let user = {
    //     activeStreamCount: 2,
    //     userID: 5
    // }

   // let x = user.activeStreamCount;

    if (user.activeStreamCount >= 0 && user.activeStreamCount <2 ){

        // user is allowed to watch
        console.log("user will be allowed to watch the requested content")

        // lambda appends the content title, sent via the e.target.contentTitle, to the contentTitlesArray
        let newTitle = e.target.contentTitle;
        contentTitlesArray.push(newTitle);
        console.log(contentTitlesArray)

        // lambda increments activeStreamCount by 1
        // let user.activeStreamCount ++;
        // console.log(activeStreamCount)

        return true;

    }else if(user.activeStreamCount >= 2){

        // user cannot watch anymore streams
        console.log("user will be prevented from watching the requested content")

        return false;
    }

    return{
        statusCode: 200,
        headers: {"Context-Type": "text/plain"},
        body: 'Calling from LambdaOne' 
    };
};
