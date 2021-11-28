import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';

export class BlameRepository{
    /**
     * 신고 이력 조회
     * @param {object} raw - {
     * user_id : 유저 아이디
     * target_type : 타입(1 : 게시물, 2 : 댓글, 3: 유저)
     * target_id : 신고한 게시물 댓글, 유저 아이디
     * transaction : 트랜잭션
     * }
     */
    async findByUserIdAndTargetIdAndTargetType(raw){
        try {
            return await sequelize.models.blames.findOne({
                where: {
                    user_id: raw.user_id,
                    target_id: raw.target_id,
                    target_type : raw.target_type
                },transaction : raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 신고
     * @param {object} raw - {
     * user_id : 유저 아이디
     * target_type : 타입(1 : 게시물, 2 : 댓글, 3: 유저)
     * target_id : 신고한 게시물 댓글, 유저 아이디
     * target_user_id : 신고들 당한 회원 아이디
     * transaction : 트랜잭션
     * }
     */
    async create(raw) {
        try {
            return await sequelize.models.blames.create(
                {
                    user_id: raw.user_id,
                    target_type: raw.target_type,
                    target_id: raw.target_id,
                    target_user_id: raw.target_user_id
                },
                {transaction: raw.transaction});
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

}