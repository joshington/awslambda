//adding implementation for the actual lambda endpoint
//extract the user data from the request body and pass it to the createDbUser method
//from our lib/db.js

const { createDbUser } = require("../lib/db");
module.exports.handler = async function registerUser(event) {
    const body = JSON.parse(event.body);


    
    return createDbUser(body)
        .then(user => ({
            statusCode:200,
            body:JSON.stringify(user)
        }))
        .catch(err => {
            console.log({  err });
            return {
                statusCode: err.statusCode || 500,
                headers: {"Content-Type":"text/plain"},
                body: { stack:err.stack, message:err.message }
            };
        });
}