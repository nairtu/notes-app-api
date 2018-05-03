import {dynamoDB} from "../libs/dynamo-db-service";
import {success, failure} from "../libs/response-service";
import {APIGatewayEvent, Callback, Context} from "aws-lambda";
import * as _ from "lodash"
import {CompositeKeyGetQuery} from "../pojos/get-dynamo-db";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

exports.handler = async function(event: APIGatewayEvent, context: Context, callback: Callback) {
    const pathParams: { [name: string]: string } | null = event.pathParameters;
    if(!(!_.isNull(pathParams) && _.has(pathParams,"id"))){
        const errorMessage = {name: "Path Param Issue", message: "Expecting Id Path Param"};
        callback(errorMessage, failure(errorMessage));
    }else{
        const getQueryCompositeKey: CompositeKeyGetQuery = {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: _.get(pathParams,"id")
        };
        const updateQuery: DocumentClient.DeleteItemInput = {
            TableName: "notes",
            Key: getQueryCompositeKey,
            ReturnValues: "ALL_OLD"
        };
        try{
            await dynamoDB.delete(updateQuery,(error, data) => {
                if(error){
                    callback(error, failure(updateQuery));
                }else{
                    callback(null, success(getQueryCompositeKey));
                }
            }).promise()
        }catch (e) {
            callback(e, failure(updateQuery));
        }
    }
};