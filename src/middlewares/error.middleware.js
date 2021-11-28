import {appLocalLogger, appS3Logger,  queryStore} from "../../logger.js";
import {sentry} from "../config.js";
import {isEmpty} from "../lib/utils.js";
import {constants} from "../common/consts.js";


export const errorMiddleware = async (err, req, res, next) => {

    if(!isEmpty(req.transaction)){
        //쿼리 로그
        await req.transaction.rollback(); //트랜잭션 롤백

    }

    let status = err.status || 500;
    const error_message = err.message;
    const client_message = err.client_message;
    const client_message_type = err.client_message_type;
    let params;

    if (req.query !== undefined && req.method === 'GET') {
        params = JSON.stringify(req.query)
    } else
        params = JSON.stringify(req.body)

    res.status(status).send({
        //success: false,
        //response:  null,
        error: {
            status: status,
            error_message: (err.__proto__.constructor.name === "DatabaseException") ? __("ERROR_DATABASE") : error_message,
            client_message: (err.__proto__.constructor.name === "DatabaseException") ?  __("ERROR_SERVER") : client_message,
            client_message_type : client_message_type
        }
    });


    const message = (err.__proto__.constructor.name === "DatabaseException" && !isEmpty(err.message.parent))  ? err.message.parent.stack + '\r Query : '  +err.message.parent.sql: err.stack;
    process.env.NODE_ENV === "production" ?
        sentry.captureException(`Catched Error : ${message}`) //운영 서버에서는 sentry에 에러로그 작성
        : appLocalLogger(err.status).log({
            level: 'error',
            message: message,
            params: params,
        });


    next();
};
