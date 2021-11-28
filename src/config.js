import * as dotenv from 'dotenv';
import {Sequelize} from "sequelize";
import redis from "redis"
import connectRedis from "connect-redis"
import session from "express-session"
import AWS from 'aws-sdk';
import {readFile} from "fs/promises";
import admin from "firebase-admin";
import * as Sentry from "@sentry/node";

dotenv.config();

/**
 * redis 클라이언트 연결
 */
const redisClient =
    (process.env.NODE_ENV === "production") ? redis.createClient({
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
        password: process.env.REDIS_PASSWORD
    }) : redis.createClient();

/**
 * AWS S3 연결
 */
AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: 'ap-northeast-2'
})

redisClient.on('connect', function () {
    console.log('Redis client connected');
});

Sentry.init({
    dsn: process.env.SENTRY_DNS_URL,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    // HTTP calls tracing
    tracesSampleRate: 1.0,
    maxValueLength : 20000,
});

export const sentry = Sentry;
/**
 * 푸시 알람 설정
 */
const serviceAccount = JSON.parse(await readFile(new URL('../firebase-admin.json', import.meta.url)));
export const pushAdmin = admin.initializeApp({ credential: admin.credential.cert(serviceAccount), });

/**
 * jwt 시크릿 설정
 */
export const jwtSecret = process.env.JWT_SECRET || 'jwt_secret';

//export const hashRounds = parseInt(process.env.HASH_ROUNDS || '10', 10);

/**
 * 세션 설정
 */
const RedisStore = connectRedis(session);
export const sessionOption =
    {
        name: 'session',
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            secure: false
        },
        store: new RedisStore({client: redisClient})
    };
if (process.env.NODE_ENV === "production") {
    sessionOption.proxy = true;
    sessionOption.cookie.secure = true;
}

/**
 * 디비 설정
 */
export const dbAccessInfo = {
    test: new Sequelize(
        process.env.DEV_DATABASE,
        process.env.DEV_USERNAME,
        process.env.DEV_PASSWORD,
        {
            host: process.env.DEV_HOST,
            dialect: process.env.DEV_DIALECT,
            define: {
                timestamps: false  // Sequlize는 기본적으로 Sequelize는 애트리뷰트
                // createdAt와 updatedAt모델을 추가하여 데이터베이스 엔트리가 언제 db에 들어 왔는지 그리고 마지막으로 업데이트 된시기를 알 수 있습니다.
            },
            timezone: "+09:00",  // DB Time과 맞춤
            pool: {				 // Connection pool
                max: 30,
                min: 0,
                acquire: 30000, //해당 풀이 오류를 발생시키기 전에 연결을 시도하는 최대 시간(밀리초)
                idle: 10000, //연결이 해제되기 전에 유휴 상태일 수 있는 최대 시간(밀리초)입니다.
            },
            logging : false
        }),
    real: new Sequelize(
        process.env.REAL_DATABASE,
        process.env.REAL_USERNAME,
        process.env.REAL_PASSWORD,
        {
            host: process.env.REAL_HOST,
            dialect: process.env.REAL_DIALECT,
            define: {
                timestamps: false  // Sequlize는 기본적으로 Sequelize는 애트리뷰트
                // createdAt와 updatedAt모델을 추가하여 데이터베이스 엔트리가 언제 db에 들어 왔는지 그리고 마지막으로 업데이트 된시기를 알 수 있습니다.
            },
            timezone: "+09:00",  // DB Time과 맞춤
            pool: {				 // Connection pool
                max: 30,
                min: 0,
                acquire: 30000, //해당 풀이 오류를 발생시키기 전에 연결을 시도하는 최대 시간(밀리초)
                idle: 10000, //연결이 해제되기 전에 유휴 상태일 수 있는 최대 시간(밀리초)입니다.
            },
            logging: false
        })
}

export default AWS;