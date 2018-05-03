import {dynamoDB} from "../libs/dynamo-db-service";
import {success, failure} from "../libs/response-service";
import {APIGatewayEvent, Callback, Context} from "aws-lambda";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

exports.handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
    const listQuery: DocumentClient.QueryInput = {
        TableName: "notes",
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    };
    try{
        await dynamoDB.query(listQuery,(error, data) => {
            if(error){
                callback(error, failure(listQuery));
            }else{
                callback(null, success(data.Items));
            }
        }).promise()
    }catch (e) {
        callback(e, failure(listQuery));
    }
};