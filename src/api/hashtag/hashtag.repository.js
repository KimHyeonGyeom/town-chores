import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';


export class HashtagRepository{

    /**
     * 게시글 해시 태그 삭제
     * @param {object} raw - {post_id : 게시글 아이디, transaction : 트랜잭션}
     */
    async deletePostById(raw) {
        try {
            return await sequelize.models.hashtags.destroy({
                where: {
                    post_id: raw.post_id,
                },
                force: true, //완전 삭제
                transaction: raw.transaction
            });
        } catch (err) {
            throw new DatabaseException(err);
        }
    }

   /**
    * 다수 해시태그 저장
    * @param {object} raw - {hashtagList : 해시태그 리스트 , transaction : 트랜잭션}
    */
    async bulkCreate(raw) {
        try{
            return await sequelize.models.hashtags.bulkCreate(
                raw.hashtagList
                ,{transaction: raw.transaction}
            );
        }
        catch (err){
            throw new DatabaseException(err);
        }
    }
}