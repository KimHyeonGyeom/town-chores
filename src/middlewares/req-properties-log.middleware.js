import {httpLogger} from "../../logger.js";
import {isEmpty} from "../lib/utils.js";

const colors = [
    { name: 'cyan', value: '\x1b[36m' },
    { name: 'yellow', value: '\x1b[33m' },
    { name: 'red', value: '\x1b[31m' },
    { name: 'green', value: '\x1b[32m' },
    { name: 'magenta', value: '\x1b[35m' },
];
const resetColor = '\x1b[0m';
/**
 * Request
 */
export const reqPropertiesLog = (req, res, next) => {

    let color;
    switch (req.method)
    {
        case 'GET' :
            color = { name: 'cyan', value: '\x1b[36m' };
            break;
        case 'POST' :
            color = { name: 'yellow', value: '\x1b[33m' };
            break;
        case 'PUT' :
            color = { name: 'green', value: '\x1b[32m'  };
            break;
        case 'PATCH' :
            color = { name: 'green', value: '\x1b[35m'  };
            break;
        case 'DELETE' :
            color = { name: 'red', value: '\x1b[31m' };
            break;
    }

    if(!isEmpty(req.query)){
        const url = req.url.toString().split('?')[0];
        log(req.method + ':' + url , req.query, color);
    }
    else if(!isEmpty(req.body)){
        log(req.method + ':' + req.url , req.body, color);
    }
    else if(!isEmpty(req.params)){
        log(req.method + ':' + req.url , req.params, color);
    }

    next();
};

/** debugLog production 환경과 브라우저일 때 미노출 된다 */
const log = (tag, msg, color) => {
    if(process.env.NODE_ENV !== "production") {
        const logString = `${color.value}[${tag}]${resetColor} ${typeof msg === 'object' ? JSON.stringify(msg) : msg}`;
        console.log(logString);

        httpLogger.log({
            level: 'info',
            message: typeof msg === 'object' ? JSON.stringify(msg) : msg,
        });
    }
}