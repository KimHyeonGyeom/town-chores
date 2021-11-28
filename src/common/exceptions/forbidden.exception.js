import { HttpException } from './http.exception.js';
import {constants} from "../consts.js";

export class ForbiddenException extends HttpException {
    constructor(errorMessage = '접근 권한이 없습니다.', clientMessage = '',clientMessageType = __("CLIENT_MESSAGE_POPUP_TYPE")) {
        super(403, errorMessage, clientMessageType, clientMessage);
    }
}
