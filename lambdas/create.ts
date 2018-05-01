import uuid from "uuid";
import {Context, APIGatewayEvent, Callback} from "aws-lambda"
import * as _ from "lodash";
import {dynamoDB} from "../libs/dynamo-db-service";
import {success, failure} from "../libs/response-service";
import {CreateDocumentItem, CreateDocumentRequest} from "../pojos/create-dynamo-db";
import {DocumentClient} from "aws-sdk/lib/dynamodb/document_client";

exports.handler = async function (event: APIGatewayEvent, content: Context, callback: Callback) {
    const eventBody: string | null = event.body;
    if (_.isNull(eventBody)) {
        const errorMessage: Error = {name: "Note create handler", message: "Event body is empty"};
        callback(errorMessage, failure(errorMessage))
    } else {
        const data: CreateDocumentRequest = JSON.parse(eventBody);
        const putEntryItem: CreateDocumentItem = {
            userId: event.requestContext.identity.cognitoIdentityId,
            noteId: uuid.v1(),
            content: data.content,
            attachment: data.attachment,
            createdAt: Date.now()
        };
        const putEntry: DocumentClient.PutItemInput = {
            TableName: "notes",
            Item: putEntryItem
        };
        try {
            await dynamoDB.put(putEntry, (error, data) => {
                if (error) {
                    callback(error, failure(putEntryItem));
                } else {
                    callback(null, success(putEntryItem));
                }
            }).promise()
        } catch (e) {
            callback(e, failure(putEntryItem));
        }


    }
};