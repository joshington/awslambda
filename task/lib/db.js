const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");



const { Model } = require("dynamodb-toolbox");
const {v4: uuidv4} = require('uuid');


const User = new Model("User", {
  // Specify table name
  table: "users-table",

  // Define partition and sort keys
  partitionKey: "pk",
  sortKey: "sk",

  // Define schema
  schema: {
    pk: { type: "string", alias: "email" },
    sk: { type: "string", hidden: true, alias: "type" },
    id: { type: "string" },
    passwordHash: { type: "string" },
    createdAt: { type: "string" }
  }
});

//INIT AWS
AWS.config.update({
    region: "us-east-1"
});
//init DynamoDB document client;
const docClient = new AWS.DynamoDB.DocumentClient();

const createDbUser = async props => {
    const passwordHash = await bcrypt.hash(props.password, 8);
    delete props.password;//dont save it in clear text

    const params = User.put({
        ...props,
        id: uuidv4(),
        type:"User",
        passwordHash,
        createdAt: new Date()
    });
    const response = await docClient.put(params).promise();
    return User.parse(response);
}

//func that retrieves a user by email so we can check if the user exists and if so
//compare the passwordHash to the hash of the password that was sent with the request.

const getUserByEmail = async email => {
    const params = User.get({email, sk: "User"});
    const response = await docClient.get(params).promise();

    return User.parse(response);
}




//export it so that we can use it in our lambda 
module.exports = {
    createDbUser,
    getUserByEmail
}
