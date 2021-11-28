import {BlameRepository} from "./blame.repository.js";
import {BadRequestException} from '../../common/exceptions/index.js';


export class BlameService {

    constructor(blameRepository) {
        /** @type {BlameRepository} */
        this.blameRepository = blameRepository
    }
    /**
     * 게시글,댓글,유저 신고
     * @param {object} raw - {
     * user_id : 유저 아이디
     * target_type : 타입(1 : 게시물, 2 : 댓글, 3: 유저)
     * target_id : 신고한 게시물 댓글, 유저 아이디
     * target_user_id : 신고들 당한 회원 아이디
     * transaction : 트랜잭션
     * }
     */
    async addBlame(raw){
        // 동일한 유저 2번 이상 신고 못하도록
        const blame = await this.blameRepository.findByUserIdAndTargetIdAndTargetType(raw)
        if (blame) {
            throw new BadRequestException(__("ERROR_BLAME_REPEATED_REPORTS_MESSAGE"), __("ERROR_BLAME_REPEATED_REPORTS_CLIENT_MESSAGE"));
        }

        await this.blameRepository.create(raw);
    }
}
