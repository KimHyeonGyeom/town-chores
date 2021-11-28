import { Router } from 'express';
import { wrap } from '../../lib/request-handler.js';
import {PostRepository} from "../post/post.repository.js";
import {SearchService} from "./search.service.js";
import {ImageRepository} from "../image/image.repository.js";
import {HashtagRepository} from "../hashtag/hashtag.repository.js";
import {validateQuery} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./search.schemas.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";

export default class SearchController {
    path = '/search';
    router = Router();

    searchService = new SearchService(new PostRepository(), new ImageRepository(), new HashtagRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();

         /**
          *  검색어  *
          1. 게시글 검색어 조회 api - getAllPosts
          2. 게시글 해시태그 조회 api - getAllPostsByHashtags
          3. 검색 자동완성 api -
         **/
         router
             .get('/', validateQuery(ajv.getAll),wrap(this.getAllPosts))
             .get('/hashtag', validateQuery(ajv.getAll),wrap(this.getAllPostsByHashtags))

        this.router.use(this.path, verifyJWT, router);
    }
    getAllPosts = async  (req,res) => {
        let{ latitude, longitude, area, size, page, query} = req.query;
        page = (page-1) * size

        const posts = await this.searchService.getAllPosts({
            titleOrComment_type : 'Y',
            user_id : req.token_user_id,
            latitude : latitude,
            longitude : longitude,
            area : area,
            size: size,
            page: page,
            query : query,
            transaction : req.transaction
        })

        return {posts: posts};
    }

    getAllPostsByHashtags = async  (req,res) => {
        let{ latitude, longitude, area, size, page, query} = req.query;
        page = (page-1) * size

        const posts = await this.searchService.getAllPosts({
            user_id : req.token_user_id,
            hashtag_type : 'Y',
            latitude : latitude,
            longitude : longitude,
            area : area,
            size: size,
            page: page,
            query : query,
            transaction : req.transaction
        })

        return {posts: posts};
    }
}
