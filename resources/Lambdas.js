const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

// params sent through via apigateway
const params = {
    TableName : TABLE_NAME,
    User: {
        userID: PRIMARY_KEY,
        accName: 'Mike'
    },
    event: {
        contentTitle: 'c'
    }
}

async function getUser(params){

    try{
        // seraching for user by user ID
       const userFound = await DynamoDB.TABLE_NAME.get(params.user).promise();

       return { body: JSON.stringify(userFound)}

    } catch (err){
        return err;
    }

}

getUser(params);

// the title sent via params from ApiGateway
const contentReqs = params.event.contentTitle;

export function LambdaOneHandler(userFound, contentReqs){

    if (userFound.activeStreamCount >= 0 && userFound.activeStreamCount <3 ){

        // user is allowed to watch
        console.log("user will be allowed to watch the requested content")

        // lambda appends the content title, to the contentTitlesArray
        let newTitle = contentReqs;
        params.user.contentTitlesArray.push(newTitle);
        console.log(contentTitlesArray)

        // lambda increments activeStreamCount by 1
        params.user.activeStreamCount ++;
        console.log(activeStreamCount)

        return{
            statusCode: 200,
            headers: {"Context-Type": "text/plain"},
            body: 'Your requested content will play shortly' 
        }

    }else if(userFound.activeStreamCount >= 3){

        // user cannot watch anymore streams
        console.log("user will be prevented from watching the requested content")

        return{
            statusCode: 200,
            headers: {"Context-Type": "text/plain"},
            body: 'You are not allowed more than three simultaneous streams ' 
        }

    }
};
