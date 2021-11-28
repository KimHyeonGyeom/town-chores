import { Router } from 'express';
import { wrap } from '../../lib/request-handler.js';
import {PostRepository} from "./post.repository.js";
import {PostService} from "./post.service.js";
import {ImageRepository} from "../image/image.repository.js";
import {HashtagRepository} from "../hashtag/hashtag.repository.js";
import {validateBody, validateParams, validateQuery} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./post.schemas.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";
import {LikeRepository} from "../like/like.repository.js";
import {UserRepository} from "../users/user.repository.js";


export default class PostController {
    path = '/posts';
    router = Router();

    postService = new PostService(new PostRepository(), new ImageRepository(), new HashtagRepository(), new LikeRepository(), new UserRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();

        /**
         *  게시글  *
         1. 게시글 등록 api - addPost
         2. 게시글 수정 api - updatePost
         3. 게시글 상세 조회 api - getPost
         4. 게시글 리스트 조회 api - getAllPosts
         5. 게시글 삭제 api - deletePost
         6. 게시글 좋아요 api - addLike
         7. 게시글 좋아요 취소 api - deleteLike
         **/
        router
            .post('/', validateBody(ajv.addPost), wrap(this.addPost))
            .put('/:post_id',  validateBody(ajv.updatePost), wrap( this.updatePost))
            .get('/', validateQuery(ajv.getPost), wrap(this.getPost))
            .get('/all', validateQuery(ajv.getAllPosts), wrap(this.getAllPosts))
            .delete('/', validateQuery(ajv.delete), wrap(this.deletePost))
            .post('/like',validateBody(ajv.addLike), wrap(this.addLike))
            .delete('/like', validateQuery(ajv.delete),wrap(this.deleteLike))

        this.router.use(this.path, verifyJWT,  router);
    }

    addPost =  async  (req, res) => {
        const {title, content, latitude, longitude, area ,hashtags} = req.body;
        const files = req.files;

        const user_id = req.token_user_id;
        const post = await this.postService.addPost({
            user_id : user_id,
            title : title,
            content : content,
            latitude : latitude,
            longitude : longitude,
            area : area,
            files : files,
            hashtags : hashtags,
            transaction : req.transaction
        });

        return {post: post};
    }

    updatePost = async (req,res) =>{
        const post_id = req.params.post_id;
        const user_id = req.token_user_id;
        const {title, content, existing_images, hashtags } = req.body;
        const files = req.files;

        const post = await this.postService.update({
            post_id : post_id,
            user_id : user_id,
            title : title,
            content : content,
            files : files,
            existing_images : existing_images,
            hashtags : hashtags,
            transaction : req.transaction
        });

        return {post: post};
    }

    getPost = async (req,res)=>{
        const {post_id} = req.query;

        const post = await this.postService.getPost({
            user_id : req.token_user_id,
            post_id : post_id,
            transaction : req.transaction
        });

        return { post: post };

    }

    getAllPosts = async (req, res) =>{
        let{ latitude, longitude, area, size, page } = req.query;
        page = (page-1) * size

        const posts = await this.postService.getAllPosts({
            user_id : req.token_user_id,
            latitude : latitude,
            longitude : longitude,
            area : area,
            size: size,
            page: page,
            transaction : req.transaction
        })

        return { posts: posts };
    }

    deletePost = async (req, res) =>{
        const {post_id} = req.query;

        await this.postService.deletePost({
            post_id: post_id,
            transaction: req.transaction,
        });

        return true;
    }

    addLike = async (req, res) => {
        const {post_id, post_user_id } = req.body;

       await this.postService.addLike({
            post_id: post_id,
            post_user_id: post_user_id,
            user_id: req.token_user_id,
            transaction: req.transaction
        });

        return true;
    }

    deleteLike = async (req, res) =>{
        const {post_id} = req.query;

        await this.postService.deleteLike({
            post_id: post_id,
            user_id : req.token_user_id,
            transaction: req.transaction,
        });

        return true;
    }
}
