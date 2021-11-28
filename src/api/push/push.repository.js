import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';

export class PushRepository{
    findById(raw){
        try{
            return sequelize.models.pushes.findOne({
                where: {
                    id: raw.id
                },
                transaction : raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 해당 유저로 푸시알림 이력 조회
     * @param {object} raw
     * {user_id : 유저 아이디, transaction : 트랜잭션}
     */
    async findAllByUserId(raw){
        try{
            return await sequelize.models.pushes.findAll({
                attributes : ['id', 'user_id','comment_id','post_id','reference_id','title','content','msg_division','is_read'],
                where : {
                    user_id: raw.user_id
                },
                offset: raw.page,
                limit: parseInt(raw.size),
                order: [['created_at', 'desc']],
                transaction : raw.transaction
            })
        }catch (err){
            throw new DatabaseException(err);
        }
    }

    /**
     * 푸시알림 저장
     * @param {object} raw
     * {user_id : 유저 아이디, comment_id : 댓글 아이디, post_id : 게시글 아이디, reference_id : 관계 유저 아이디, title : 제목, content : 내용, msg_division : 메시지 구분 (1 : 댓글), transaction : 트랜잭션}
     */
    async create(raw) {
        try{
            return await sequelize.models.pushes.create({
                user_id : raw.user_id,
                comment_id : raw.comment_id,
                post_id : raw.post_id,
                reference_id : raw.reference_id,
                title : raw.title,
                content : raw.content,
                msg_division : raw.msg_division,
            },{transaction : raw.transaction});
        }catch (err){
            throw new DatabaseException(err);
        }
    }
    /**
     * 푸시알림 읽음 표시로 변경
     * @param {object} raw
     * {push_id : 푸시 아이디, user_id : 유저 아이디, transaction : 트랜잭션}
     */
    async updateIsRead(raw) {
        try {
            return await sequelize.models.pushes.update({
                    is_read: true,
                }, {
                    where: {
                        id: raw.push_id,
                        user_id: raw.user_id
                    }, transaction: raw.transaction
                }
            )
        } catch (err) {
            throw new DatabaseException(err);
        }
    }
}