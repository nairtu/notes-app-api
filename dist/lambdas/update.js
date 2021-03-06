"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dynamo_db_service_1 = require("../libs/dynamo-db-service");
const response_service_1 = require("../libs/response-service");
const _ = __importStar(require("lodash"));
exports.handler = function (event, context, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const pathParams = event.pathParameters;
        const eventBody = event.body;
        if (!(!_.isNull(pathParams) && _.has(pathParams, "id"))) {
            const errorMessage = { name: "Path Param Issue", message: "Expecting Id Path Param" };
            callback(errorMessage, response_service_1.failure(errorMessage));
        }
        else if (_.isNull(eventBody)) {
            const errorMessage = { name: "Event Body Missing", message: "Update Event Body Missing" };
            callback(errorMessage, response_service_1.failure(errorMessage));
        }
        else {
            const getQueryCompositeKey = {
                userId: event.requestContext.identity.cognitoIdentityId,
                noteId: _.get(pathParams, "id")
            };
            const updateEventBody = JSON.parse(eventBody);
            const updateQuery = {
                TableName: "notes",
                Key: getQueryCompositeKey,
                UpdateExpression: "SET content = :content, attachment = :attachment",
                ExpressionAttributeValues: {
                    ":content": updateEventBody.content,
                    ":attachment": updateEventBody.attachment
                },
                ReturnValues: "ALL_NEW"
            };
            try {
                yield dynamo_db_service_1.dynamoDB.update(updateQuery, (error, data) => {
                    if (error) {
                        callback(error, response_service_1.failure(updateQuery));
                    }
                    else {
                        callback(null, response_service_1.success(updateEventBody));
                    }
                }).promise();
            }
            catch (e) {
                callback(e, response_service_1.failure(updateQuery));
            }
        }
    });
};
