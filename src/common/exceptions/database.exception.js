import { HttpException } from './http.exception.js';
import {constants} from "../consts.js";

export class DatabaseException extends HttpException {
    constructor(errorMessage = '데이터베이스 에러가 발생되었습니다.', clientMessage = '',clientMessageType = __("CLIENT_MESSAGE_POPUP_TYPE")) {
        super(500, errorMessage, clientMessageType, clientMessage);
    }
}
