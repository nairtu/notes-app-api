import {dynamoDB} from "../libs/dynamo-db-service";
import {success, failure} from "../libs/response-service";
import {APIGatewayEvent, Callback, Context} from "aws-lambda";
import * as _ from "lodash"
import {CompositeKeyGetQuery} from "../pojos/get-dynamo-db";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";
import {ContentAttachment} from "../pojos/create-dynamo-db";

exports.handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
    const pathParams: { [name: string]: string } | null = event.pathParameters;
    const eventBody: string | null = event.body;
    if(!(!_.isNull(pathParams) && _.has(pathParams,"id"))){
        const errorMessage = {name: "Path Param Issue", message: "Expecting Id Path Param"};
        callback(errorMessage, failure(errorMessage));
    }else if (_.isNull(eventBody)){
        const errorMessage = {name: "Event Body Missing", message: "Update Event Body Missing"};
        callback(errorMessage, failure(errorMessage));
    } else{
        const getQueryCompositeKey: CompositeKeyGetQuery = {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: _.get(pathParams,"id")
        };
        const updateEventBody: ContentAttachment = JSON.parse(eventBody);
        const updateQuery: DocumentClient.UpdateItemInput = {
            TableName: "notes",
            Key: getQueryCompositeKey,
            UpdateExpression: "SET content = :content, attachment = :attachment",
            ExpressionAttributeValues: {
                ":content": updateEventBody.content,
                ":attachment": updateEventBody.attachment
            },
            ReturnValues: "ALL_NEW"
        };
        try{
            await dynamoDB.update(updateQuery,(error, data) => {
                if(error){
                    callback(error, failure(updateQuery));
                }else{
                    callback(null, success(updateEventBody));
                }
            }).promise()
        }catch (e) {
            callback(e, failure(updateQuery));
        }
    }
};