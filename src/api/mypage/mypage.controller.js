import { Router } from 'express';
import { wrap } from '../../lib/request-handler.js';
import {PostRepository} from "../post/post.repository.js";
import {MypageService} from "./mypage.service.js";
import {validateQuery} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./mypage.schemas.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";

export default class MypageController{
    path = '/mypage';
    router = Router();

    mypageService = new MypageService(new PostRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();

         /**
          * 마이페이지 *
          * 1.마이페이지 게시물 조회 api - findById
         **/

        router
            .get('/', validateQuery(ajv.getAllPostsByUser), wrap(this.getAllPostsByUser))

        this.router.use(this.path,verifyJWT, router);
    }

    getAllPostsByUser =  async  (req, res) => {
        let {page,size} = req.query;
        page = (page-1) * size
        const user_id = req.token_user_id;

        const posts = await this.mypageService.getAllPostsByUser({
            user_id : user_id,
            page : page,
            size : size,
            transaction : req.transaction
        });

        return { posts: posts };
    }
}
