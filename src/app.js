import express, { Router } from 'express';
import session from 'express-session';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { s3Upload} from "./lib/utils.js";
import {sentry, sessionOption} from "./config.js";
import helmet from "helmet"; //보안을 책임 져준다. 실제 서버에서 사용하면 좋다.
import hpp from "hpp";
import sequelize from "./lib/database.js";
import i18n from '../i18n.js';

class App {
    app;
    router;
    constructor(controllers) {

        /**
         User.sync() - 존재하지 않는 경우 테이블을 생성합니다(이미 존재하는 경우 아무 작업도 수행하지 않음).
         User.sync({ force: true }) - 이것은 테이블을 생성하고 이미 존재하는 경우 먼저 삭제합니다.
         User.sync({ alter: true }) - 데이터베이스에 있는 테이블의 현재 상태(열이 있는 열, 데이터 유형이 무엇인지 등)를 확인한 다음 테이블에서 필요한 변경을 수행하여 모델과 일치하도록 합니다.
         **/
        sequelize.sync();
        this.app = express();
        this.form_data = s3Upload();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();

    }

    getServer(){
        return this.app;
    }

    /**
     * 서버 생성
     */
    listen() {
        const port = process.env.PORT || 5000;
        this.app.listen(port, () => {
            console.log(`App listening on the port ${port}`);
        });
    }

    /**
     * 미들웨어 초기화
     */
    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        if(process.env.NODE_ENV === "production"){
            /**
             * Helmet을 이용하면 HTTP 헤더를 적절히 설정하여 몇 가지 잘 알려진 웹 취약성으로부터 앱을 보호할 수 있습니다.
               사실 Helmet은 보안 관련 HTTP 헤더를 설정하는 다음과 같은 더 작은 크기의 미들웨어 함수 9개의 모음입니다.
               1. csp는 Content-Security-Policy 헤더를 설정하여 XSS(Cross-site scripting) 공격 및 기타 교차 사이트 인젝션을 예방합니다.
               2. hidePoweredBy는 X-Powered-By 헤더를 제거합니다.
               3. hsts는 서버에 대한 안전한(SSL/TLS를 통한 HTTP) 연결을 적용하는 Strict-Transport-Security 헤더를 설정합니다.
               4. ieNoOpen은 IE8 이상에 대해 X-Download-Options를 설정합니다.
               5. noCache는 Cache-Control 및 Pragma 헤더를 설정하여 클라이언트 측에서 캐싱을 사용하지 않도록 합니다.
               6. noSniff는 X-Content-Type-Options 를 설정하여, 선언된 콘텐츠 유형으로부터 벗어난 응답에 대한 브라우저의 MIME 가로채기를 방지합니다.
               7. frameguard는 X-Frame-Options 헤더를 설정하여 clickjacking에 대한 보호를 제공합니다.
               8. xssFilter는 X-XSS-Protection을 설정하여 대부분의 최신 웹 브라우저에서 XSS(Cross-site scripting) 필터를 사용하도록 합니다.
             */
            this.app.use(helmet());
            /**
             * Express가 동일한 이름을 가진 파라메터가들이 있을 경우 Array로 만들어주는데 의도치 않은 동작을 하도록 외부에서 공격할 수 있는 보안 문제가 될 수 있다고 합니다.
             * 입력 데이터 검증을 회피하거나 앱 크래시를 유발 시킬 수 있죠. 이를 방어하기 위한 express 모듈입니다.
             */
            this.app.use(hpp()); //HTTP Parameter pollution을 방어
        }
        this.app.use(sentry.Handlers.tracingHandler()); //Tag 정보 확인
        this.app.use(sentry.Handlers.requestHandler()); //이벤트에 어떤 데이터가 포함되어 있는지 알 수 있음.
        //morgan.token('properties', function setProperties (req) { return getProperties(req)});
        this.app.use(this.form_data.array('files'));
        this.app.use(sentry.Handlers.errorHandler());
        this.app.use(session(sessionOption));
        this.app.use(i18n);
        //개발 환경 로그 운영 환경 로그 구분
        //(process.env.NODE_ENV === "production") ? this.app.use(morgan(" [:method :url] [HTTP/:http-version] [:remote-addr] :response-time ms :properties" ,{stream : httpLogStream})) : this.app.use(reqPropertiesLog); // NOTE: http request 로그 남기기
        //this.app.use(sentry.Handlers.tracingHandler());
    }

    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    initializeControllers(controllers) {
        const router = Router();

        controllers.forEach((controller) => {
            router.use(controller.router);
        });

        this.app.use('/api', router);

        //express에서는 스웨거 설정이 너무 복잡하기에 우선 포스트맨을 사용하고 추후에 nest.js로 변경 시 swagger로 api 관리
        //this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
    }
}

export default App;
