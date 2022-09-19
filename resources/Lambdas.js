// this lambda will expect two objects as params(e, user)
// it will then connect to DynamoDB and check the contentTitlesArray.Length value of the userID
// if contentTitlesArray.Length >=3, it will return false
// if contentTitlesArray.Length <3, it will return positive

export async function LambdaOneHandler(e, user){

    // checking if the two objects are being passed successfully
    console.log(user);
    console.log(e);

    // DB connection/reading happens here
    // lambda then finds the user by user.userID in the DB
    // lambda then checks the value of activeStreamCount

    // this is test data used to fire the lambda via the myApiGateway
    // let user = {
    //     activeStreamCount: 2,
    //     userID: 5
    // }

   let x = user.activeStreamCount;

    if (x >= 0 && x <2 ){

        // user is allowed to watch
        console.log("user will be allowed to watch the requested content")

        // lambda appends the content title, sent via the e.target.contentTitle, to the contentTitlesArray
        let newTitle = e.target.contentTitle;
        contentTitlesArray.push(newTitle);
        console.log(contentTitlesArray)

        // lambda increments activeStreamCount by 1
        // let user.activeStreamCount ++;
        console.log(activeStreamCount)

        return true;

    }else if(x >= 2){
        console.log("user will be prevented from watching the requested content")

        return false;
    }
    return{
        statusCode: 200,
        headers: {"Context-Type": "text/plain"},
        body: 'Calling from LambdaOne' 
    };
};
