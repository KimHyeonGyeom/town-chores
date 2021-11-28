import { Router } from 'express';
import { wrap } from '../../lib/request-handler.js';
import {BlameRepository} from "./blame.repository.js";
import {BlameService} from "./blame.service.js";
import {PostRepository} from "../post/post.repository.js";
import {CommentRepository} from "../comment/comment.repository.js";
import {validateBody} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./blame.schemas.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";

export default class BlameController{
    path = '/blames';
    router = Router();

    blameService = new BlameService(new BlameRepository(), new PostRepository(),new CommentRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();
         /**
          * 신고 *
          * 1. 게시물, 댓글 신고 api - addBlame
         **/
        router
            .post('/:target_type', validateBody(ajv.addBlame), wrap(this.addBlame))

        this.router.use(this.path, verifyJWT, router);

    }

    addBlame =  async  (req, res) => {
        const target_type = req.params.target_type;
        const {target_id,target_user_id} = req.body;
        const user_id = req.token_user_id;

        await this.blameService.addBlame({
            user_id : user_id,
            target_id : target_id,
            target_user_id : target_user_id,
            target_type : Number(target_type),
            transaction : req.transaction
        });

        return true;
    }
}

