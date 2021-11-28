import pkg from 'winston';
import path from 'path';
import mt from 'moment-timezone';
import AWS from "../neighborhood-chores/src/config.js";
import {isEmpty} from "./src/lib/utils.js";


const __dirname = path.resolve();
const {combine, label, printf} = pkg.format;
const date = mt().tz('Asia/Seoul'); // NOTE: 날짜는 한국 시간으로 하고 싶다.
const myErrorFormat = printf(info => `\x1b[31m ${info.timestamp} [${info.level}]: ${info.label} \x1b[0m - ${info.message}  \r\n ${info.params}`); // NOTE: 로그 형식 설정
const myHttpFormat = printf(info => `${info.timestamp} [${info.level}]: ${info.label} - ${info.message}`); // NOTE: 로그 형식 설정
const koreaTime = pkg.format((info) => { // NOTE: 한국 시간으로 하기 위해.. 설정을 안 할 시 에는 UTC 0이 default다.
    info.timestamp = date.format();
    return info;
});
const Colors = {
    info: "\x1b[36m",
    error: "\x1b[31m",
    warn: "\x1b[33m",
    verbose: "\x1b[43m",
};


export const queryStore = new Map();

/**
 *  앱 로그 로컬 파일에 저장
 */
export const appLocalLogger = (status) => { // NOTE: application log를 남기기 위함.
    const init = pkg.createLogger({
        format: combine(
            label({label: status}),
            koreaTime(),
            myErrorFormat,
        ),
        transports: [
            new pkg.transports.File({filename: path.join(__dirname, 'logs', 'app-error.log'), level: 'error'}), // NOTE: 에러는 별도로 보기 위함
            new pkg.transports.File({filename: path.join(__dirname, `logs`, date.format('YYYY-MM-DD'), 'app.log')}), // NOTE: 모든 로그 (에러 포함)
        ],
    });
    if (process.env.NODE_ENV !== 'production') { // NOTE: 실제 서비스 환경이 아닐 시에는 출력을 해야 바로 바로 보기 편함.
        init.add(new pkg.transports.Console());
    }
    return init;
};

/**
 *  로그 AWS S3에 저장
 */
export const appS3Logger = (type, data) => {
    let s3 = new AWS.S3();
    let content;
    let fileName;
    if (type === 'http') {
        content = `[${data.level}]: - ${data.message}`;
        fileName = 'test-http'
    } else if (type === 'error') {
        content = `[${data.level}]: ${data.label} - ${data.message}  \r\n ${data.params}`;
        fileName = 'test-app-error'
    } else if (type === 'query') {
        content = `[${data.level}]: - ${data.message}`;
        fileName = 'test-query'
    }
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: `${date.format('YYYY-MM-DD')}/${fileName}.log`
    }

    s3.getObject(params, function (err, data) {
        if (!isEmpty(err) && err.statusCode === 404) {
            s3 = new AWS.S3();
            const params = {
                Bucket: process.env.S3_BUCKET,
                Key: `${date.format('YYYY-MM-DD')}/${fileName}.log`,
                Body: content
            }
            s3.upload(params, (err, data) => {
            })
        } else {
            let newContent = new Buffer(data.Body).toString("utf8");
            newContent = newContent + '\n' + new Date() + '\t' + content;

            const putParams = {
                Body: newContent,
                Bucket: process.env.S3_BUCKET,
                Key: `${date.format('YYYY-MM-DD')}/${fileName}.log`,
                ACL: "public-read"
            };

            s3.putObject(putParams, function (err, data) {
            });
        }
    });
};


/**
 *  http 로그 로컬에 저장
 */
export const httpLogger = pkg.createLogger({ // NOTE: http status 로그를 남기기 위함.
        format: combine(
            label({label: 'http'}),
            koreaTime(),
            myHttpFormat,
        ),
        transports: [
            new pkg.transports.File({filename: path.join(__dirname, 'logs', date.format('YYYY-MM-DD'), 'http.log')}),
        ],
    }
);


/**
 *  http 로그 morgan
 */
export const httpLogStream = {
    write: (message) => { // NOTE: morgan에서 쓰기 위해 이 형태로 fix 되야함.
        if (process.env.NODE_ENV !== "production") {
            httpLogger.log({
                level: 'info',
                message: message,
            });
        }
       //console.log(message);
    }
};


