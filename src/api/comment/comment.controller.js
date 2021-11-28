import {Router} from 'express';
import {wrap} from '../../lib/request-handler.js';
import {CommentService} from "./comment.service.js";
import {CommentRepository} from "./comment.repository.js";
import {validateBody, validateQuery} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./comment.schemas.js";
import {UserRepository} from "../users/user.repository.js";
import {PostRepository} from "../post/post.repository.js";
import {PushRepository} from "../push/push.repository.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";


export default class CommentController {
    path = '/comments';
    router = Router();

    commentService = new CommentService(new CommentRepository(), new UserRepository(), new PostRepository(), new PushRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();

        /**
         * 댓글 *
         * 1. 댓글 등록 api - addComment
         * 2. 댓글 삭제 api - deleteComment
         * 3. 게시글 댓글 조회 api - getPostComments
         * 4. 댓글 상세 조회 api - getComments
         **/

        router
            .get('/post', validateQuery(ajv.getPostComments), wrap(this.getPostComments))
            .get('/', validateQuery(ajv.getComments), wrap(this.getComments))
            .post('/', validateBody(ajv.addComment), wrap(this.addComment))
            .delete('/', validateQuery(ajv.deleteComment), wrap(this.deleteComment))

        this.router.use(this.path,verifyJWT, router);
    }

    getComments = async (req, res) => {
        const {comment_id} = req.query;

        const comments = await this.commentService.getComments({
            comment_id: comment_id,
            user_id : req.token_user_id,
            transaction: req.transaction
        })

        return { comments: comments };
    }

    getPostComments = async (req, res) => {
        const {post_id} = req.query;

        const comments = await this.commentService.getPostComments({
            post_id: post_id,
            user_id : req.token_user_id,
            transaction: req.transaction
        });

        return { comments: comments };
    }

    addComment = async (req, res) => {
        const {post_id, comment, parent_comment_id} = req.body;
        const user_id = req.token_user_id;

        const new_comment = await this.commentService.addComment({
            user_id: user_id,
            post_id: post_id,
            comment: comment,
            parent_comment_id: parent_comment_id,
            transaction: req.transaction
        })

        return { comment: new_comment };
    }

    deleteComment = async (req, res) => {
        const {comment_id} = req.query;

        await this.commentService.deleteComment({
            id: comment_id,
            transaction: req.transaction
        });

        return true;
    }
}
