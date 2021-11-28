import {constants} from "../consts.js";

export class HttpException extends Error {
    constructor(status, errorMessage, clientMessageType, clientMessage) {
         super();
         this.status = status;
         this.message = errorMessage;
         this.client_message_type = clientMessageType
         this.client_message = clientMessage
    }
}
