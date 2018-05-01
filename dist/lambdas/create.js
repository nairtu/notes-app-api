"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
const _ = __importStar(require("lodash"));
const dynamo_db_service_1 = require("../libs/dynamo-db-service");
const response_service_1 = require("../libs/response-service");
exports.handler = function (event, content, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const eventBody = event.body;
        if (_.isNull(eventBody)) {
            const errorMessage = { name: "Note create handler", message: "Event body is empty" };
            callback(errorMessage, response_service_1.failure(errorMessage));
        }
        else {
            const data = JSON.parse(eventBody);
            const putEntryItem = {
                userId: event.requestContext.identity.cognitoIdentityId,
                noteId: uuid_1.default.v1(),
                content: data.content,
                attachment: data.attachment,
                createdAt: Date.now()
            };
            const putEntry = {
                TableName: "notes",
                Item: putEntryItem
            };
            try {
                yield dynamo_db_service_1.dynamoDB.put(putEntry, (error, data) => {
                    if (error) {
                        callback(error, response_service_1.failure(putEntryItem));
                    }
                    else {
                        callback(null, response_service_1.success(putEntryItem));
                    }
                }).promise();
            }
            catch (e) {
                callback(e, response_service_1.failure(putEntryItem));
            }
        }
    });
};
