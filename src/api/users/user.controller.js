import { Router } from 'express';
import { wrap } from '../../lib/request-handler.js';
import { UserService } from './user.service.js';
import {UserRepository} from "./user.repository.js";
import {validateBody,validateQuery} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./user.schemas.js";
import {PushRepository} from "../push/push.repository.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";

export default class UserController {
    path = '/users';
    router = Router();

    userService = new UserService(new UserRepository(), new PushRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();

         /**
          *  유저  *
          1.회원 정보 저장 api - signUp
          2.로그인 api - login
          3.내정보 api  - getCurrentUser
          4.유저정보 수정 api  - updateUser
          5.푸시알람 조회 api - getPushes
          6.로그아웃 api - logout
         **/

         router
             .post('/', validateBody(ajv.signUp), wrap(this.signUp))
             .get('/nhc-login', validateQuery(ajv.login), wrap(this.login))
             .get('/', verifyJWT, wrap(this.getCurrentUser))
             .put('/', verifyJWT, wrap(this.updateUser))
             .get('/pushes', verifyJWT, validateQuery(ajv.getPushes),wrap(this.getPushes))
             .post('/nhc-logout', verifyJWT, wrap(this.logout))

        this.router.use(this.path, router);
    }

    getCurrentUser = async (req,res) =>{
        const user_id = req.token_user_id;

        const user = await this.userService.getCurrentUser({
            user_id : user_id,
            transaction : req.transaction
        })

        return { user : user };
    }

    login = async (req, res) => {
        const {social_id,device_token} = req.query;

        const [token, user] = await this.userService.login({
            social_id : social_id,
            device_token : device_token,
            transaction :  req.transaction
        });


        //세션 key 저장
        req.session.key = user.dataValues.id;

        return {
            token,
            user: user
        };
    }

    signUp = async (req, res) => {
        const {nickname, social_id, social_type, latitude, longitude} = req.body;

        const user = await this.userService.signUp({
            nickname : nickname,
            social_id : social_id,
            social_type : social_type,
            latitude : latitude,
            longitude : longitude,
            transaction :  req.transaction
        });

        return {user : user};
    }

    updateUser = async (req, res) => {
        const user_id = req.token_user_id;
        const image = req.files;

        const user = await this.userService.updateUser({
            user_id : user_id,
            image : image,
            transaction : req.transaction
        })

        return {user : user};
    }

    getPushes = async (req, res) => {
        const user_id = req.token_user_id;
        let{ size, page } = req.query;
        page = (page-1) * size

        const pushes =  await this.userService.getPushes({
            user_id,
            size: size,
            page: page,
            transaction : req.transaction
        })

        return {pushes : pushes};
    }

    logout = async (req ,res) =>{

        //세션 삭제
        req.session.destroy(req.token_user_id);

        return true;
    }
}
