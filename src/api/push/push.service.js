
import {PushRepository} from "./push.repository.js";

export class PushService {

    constructor(pushRepository ) {
        /** @type {PushRepository} */
        this.pushRepository = pushRepository
    }
    /**
     * 푸시알림 읽기
     * @param {object} raw
     * {push_id : 푸시 아이디, user_id : 유저 아이디, transaction : 트랜잭션}
     */
    async updateIsRead(raw){
        await this.pushRepository.updateIsRead(raw);
    }
}
