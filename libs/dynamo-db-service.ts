import AWS from "aws-sdk"

AWS.config.update({ region: "us-east-2" });

let dynamoDB = new AWS.DynamoDB.DocumentClient();

export {dynamoDB}