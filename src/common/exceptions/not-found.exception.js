import { HttpException } from './http.exception.js';
import {constants} from "../consts.js";

export class NotFoundException extends HttpException {
    constructor(errorMessage = '찾을 수 없습니다.',  clientMessage = '', clientMessageType = __("CLIENT_MESSAGE_POPUP_TYPE")) {
        super(404, errorMessage, clientMessageType, clientMessage);
    }
}
