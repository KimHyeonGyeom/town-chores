import { HttpException } from './http.exception.js';
import {constants} from "../consts.js";

export class UnauthorizedException extends HttpException {
    constructor(errorMessage = '인증 자격 증명이 유효하지 않습니다.', clientMessage = '', clientMessageType = __("CLIENT_MESSAGE_POPUP_TYPE")) {
        super(401, errorMessage, clientMessageType, clientMessage);
    }
}
