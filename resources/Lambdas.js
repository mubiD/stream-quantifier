// this lambda will expect two objects as params(e, user)
// it will then connect to DynamoDB and check the contentTitlesArray.Length value of the userID
// if contentTitlesArray.Length >=3, it will return false
// if contentTitlesArray.Length <3, it will return positive
export async function LambdaOneHandler(e, user){

    console.log(user);
    console.log(e);
    //console.log("request:", JSON.stringify(e, null, 2));

    // DB connection happens here
    // lambda then finds the user by user.userID
    // lambda then checks the length of contentTitlesArray

    if (user.contentTitles.Length >= 0 && user.contentTitles.Length <3 ){
        console.log("user will be allowed to watch the requested content")

        // if the user is allowed to watch, 
        // lambda needs to append the content title, sent via the event, to the contentTitlesArray
        let newTitle = e.contentTitle;
        contentTitlesArray.push(newTitle);
        console.log(contentTitlesArray)

        return true;
    }else if(user.contentTitles.Length >= 3){
        console.log("user will be prevented from watching the requested content")

        return false;
    }
    // return{
    //     statusCode: 200,
    //     headers: {"Context-Type": "text/plain"},
    //     body: 'Calling from LambdaOne' 
    // };
};
