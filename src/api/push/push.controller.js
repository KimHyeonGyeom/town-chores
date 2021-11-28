import { Router } from 'express';
import { wrap } from '../../lib/request-handler.js';
import {PushService} from "./push.service.js";
import {PushRepository} from "./push.repository.js";
import {validateQuery} from "../../middlewares/ajv.middleware.js";
import {ajv} from "./push.schemas.js";
import {verifyJWT} from "../../middlewares/auth.middleware.js";

export default class PushController{
    path = '/pushes';
    router = Router();

    pushService = new PushService(new PushRepository());

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();
        /**
         * 푸시알림 *
         * 1.푸시알림 읽기 api - updateIsRead
         **/

        router
            .patch('/read',verifyJWT, validateQuery(ajv.updateIsRead), wrap(this.updateIsRead))


        this.router.use(this.path,verifyJWT, router);

    }
    updateIsRead =  async  (req, res) => {
        const user_id = req.token_user_id;
        const {push_id} = req.query;

        await this.pushService.updateIsRead({
            user_id : user_id,
            push_id : push_id,
            transaction : req.transaction
        });

        return true;
    }
}
