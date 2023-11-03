
//break down my login
//get email & password from request payload
//try to get user record from db for email
//if found, hash pwd and compare with passwordHash from user record
//if password is correct, create a valid jwt session token and send it back to the 
//client

const { login } = require("../lib/utils");

module.exports.handler = async function signInUser(event){
    const body = JSON.parse(event.body);

    return login(body)
        .then(session => ({
            statusCode: 200,
            body: JSON.stringify(session)
        }))
        .catch(err => {
            console.log({ err });
            return {
                statusCode: err.statusCode  || 500,
                headers: {"Content-Type":"text/plain"},
                body: {stack: err.stack, message: err.message}
            };
        });
}