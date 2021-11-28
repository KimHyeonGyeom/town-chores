import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';
import pkg from 'moment-timezone';
const {now} = pkg;



export class LikeRepository {

    /**
     * 좋아요 조회
     * @param {object} raw - {user_id : 유저 아이디 , post_id : 게시글 아이디, transaction : 트랜잭션}
     */
    async findByUserIdAndBoardId(raw){
        try{
            return await sequelize.models.likes.findOne({
                where : {
                    user_id : raw.user_id,
                    post_id : raw.post_id
                }
                ,transaction : raw.transaction
                ,paranoid : false,
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }

   /**
    * 좋아요 추가
    * @param {object} raw - {user_id : 유저 아이디 , post_id : 게시글 아이디, transaction : 트랜잭션}
    */
    async create(raw) {
        try{
            return await sequelize.models.likes.create({
                user_id : raw.user_id,
                post_id : raw.post_id
                },{transaction: raw.transaction}
            );
        }
        catch (err){
            throw new DatabaseException(err);
        }
    }

    /**
     * 기존 좋아요 수정
     * @param {object} raw - {user_id : 유저 아이디, post_id : 게시글 아이디, transaction : 트랜잭션}
     */
    async update(raw) {
        try{
            return await sequelize.models.likes.update({
                deletedAt : null
            }, {
                where: {
                    user_id: raw.user_id,
                    post_id : raw.post_id
                },
                transaction: raw.transaction,
                paranoid : false
            });
        }
        catch (err){
            throw new DatabaseException(err);
        }
    }

    /**
     * 좋아요 삭제
     * @param {object} raw - {post_id : 게시글 아이디, user_id : 유저 아이디,  transaction : 트랜잭션}
     */
    async deleteById(raw) {
        try {
            return await sequelize.models.likes.destroy({
                where: {
                    post_id: raw.post_id,
                    user_id : raw.user_id,
                },
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }
}