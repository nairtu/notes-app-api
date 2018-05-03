"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamo_db_service_1 = require("../libs/dynamo-db-service");
const response_service_1 = require("../libs/response-service");
exports.handler = function (event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const listQuery = {
            TableName: "notes",
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": event.requestContext.identity.cognitoIdentityId
            }
        };
        try {
            yield dynamo_db_service_1.dynamoDB.query(listQuery, (error, data) => {
                if (error) {
                    callback(error, response_service_1.failure(listQuery));
                }
                else {
                    callback(null, response_service_1.success(data.Items));
                }
            }).promise();
        }
        catch (e) {
            callback(e, response_service_1.failure(listQuery));
        }
    });
};
