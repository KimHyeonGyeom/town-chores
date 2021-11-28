import multer from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import AWS, {pushAdmin} from "../config.js";
import fs from "fs";
import {BadRequestException} from '../common/exceptions/index.js';
import {constants} from "../common/consts.js";

export const  ResponseSucceed = async (response) =>{
    return {
        success: true,
        response: response
    }
}

/**
 * 긴 문자열 생략표시(...)
 * @param {string} text - 텍스트
 */
export const textLengthOverCut = (text) => {
    const length = 13; // 표시할 글자수 기준
    if (text.length > length) {
        text = text.substr(0, length - 2) + '...';
    }
    return text;
}

/**
 * 푸시 알람
 * @param {object} raw - {data : 푸시 제목, 내용, device_token : 디바이스 도큰}
 */
export const pushAlarm = async (raw) =>{
    try{
        //디바이스의 토큰 값
        const deviceToken = raw.device_token
        const message = {
            data: raw.data,
            token: deviceToken,
        }
        await pushAdmin.messaging().send(message);
    }catch (err){
        throw new BadRequestException(__("ERROR_PUSH_SEND"));
    }
}

/**
 * 로컬 파일 업로드
 */
export const localUpload = () =>{
    return multer({
        storage: multer.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path.extname(file.originalname);
                const file_name = path.basename(file.originalname, ext) + Date.now() + ext;
                cb(null, file_name);
                file.file_name = file_name;
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    });
}

/**
 * AWS S3 파일 업로드
 */
export const  s3Upload = () =>{
    return multer({
        storage: multerS3({
            s3 : new AWS.S3(),
            bucket : 'neighborhood-chores',
            key(req,file,cb){
                (process.env.NODE_ENV === 'production') ? cb(null, `real-images/${Date.now()}${path.basename(file.originalname)}`) : cb(null, `dev-images/${Date.now()}${path.basename(file.originalname)}`);
            },
        }),
        limits :  { fileSize: 10 * 1024 * 1024 },
    });
}

/**
 *  배열 트리구조로 변경
 *  @param {object} array - tree구조로 변경할 array
 *  @param {string} idFieldName - array의 member에서 id
 *  @param {string} parentIdFieldName - array의 member에서 부모 id
 *  @param {string} childrenFieldName - 생성된 자식들을 넣을 field
 */
export const convertToTrees = (array, idFieldName, parentIdFieldName, childrenFieldName) =>{
    const cloned = array.slice();
    let filtered ;
    for(let i=cloned.length-1; i>-1; i--){
        const parentId = cloned[i][parentIdFieldName];

        if(parentId){
            filtered = array.filter(function(elem){
                return elem[idFieldName].toString() === parentId.toString();
            });

            if(filtered.length){
                const parent = filtered[0].dataValues;

                if(parent[childrenFieldName]){
                    parent[childrenFieldName].unshift(cloned[i]);
                }
                else {
                    parent[childrenFieldName] = [cloned[i]];
                }
            }
            cloned.splice(i,1);
        }
    }
    return cloned;
}

// /**
//  *  트랜잭션 주입
//  *  @param {object} t - 트랜잭션
//  */
// export const createTransaction = (t) =>{
//     transaction.push(t);
// }


/**
 *  객체가 비어있는지 확인
 *  @param {object} value - 객체
 */
export const isEmpty = function (value) {
    if (value === "" || value === null || value === undefined || (typeof value === "object" && !Object.keys(value).length)) {
        return true
    } else {
        return false
    }
};

/**
 *  업로드 폴더 생성
 */
export const createUploadFolder = () =>{
    try {
        fs.readdirSync('uploads');
    } catch (error) {
        fs.mkdirSync('uploads');
    }
}
/**
 *  요청으로 들어온 속성 중 존재하는 파라미터 찾아서 반환
 */
export const getProperties = (req) => {
    if(!isEmpty(req.query)){
        req.properties = req.query;
    }
    else if(!isEmpty(req.body)){
        req.properties =  req.body;
    }
    else if(!isEmpty(req.params)){
        req.properties = req.params;
    }
    return JSON.stringify(req.properties)
}

/**
 * validate properties에 지정한 타입에 맞게 변경
 */
export const propertiesTypeChange = (req, validate) =>{
    /**Object.entries() 메서드는 for...in와 같은 순서로 주어진 객체 자체의 enumerable 속성 [key, value] 쌍의 배열을 반환합니다. (for-in 루프가 다른점은 프로토 타입 체인의 속성도 열거한다는 점입니다).*/
    for (const [key, value] of Object.entries(validate.schema.properties)) {
        if(value.type === 'number'){
           req[key] = parseFloat(req[key])
        }else if(value.type === 'array'){
            if(!isEmpty(req[key]) && req[key].constructor !== Array )
                req[key] = Array(req[key])
        }
    }
}