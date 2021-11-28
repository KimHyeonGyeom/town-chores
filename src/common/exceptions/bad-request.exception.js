import { HttpException } from './http.exception.js';
import {constants} from "../consts.js";

export class BadRequestException extends HttpException {
    constructor(errorMessage = '잘못된 요청입니다.',  clientMessage = '',clientMessageType = __("CLIENT_MESSAGE_POPUP_TYPE")) {
        super(400,errorMessage, clientMessageType, clientMessage);
    }
}
