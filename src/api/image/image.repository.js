import sequelize from "../../models/index.js";
import {DatabaseException} from '../../common/exceptions/index.js';



export class ImageRepository {

  /**
   * 다수 이미지 저장
   * @param {object} raw - {imageList : 이미지 리스트, transaction : 트랜잭션}
   */
   async bulkCreate(raw) {
        try
        {
            return await sequelize.models.images.bulkCreate(
                raw.imageList
                ,{transaction: raw.transaction}
            );
        }catch (err){
            throw new DatabaseException(err);
        }
    }


   /**
    * 이미지 삭제
    * @param {object} raw - {id : 이미지 아이디 , transaction : 트랜잭션}
    */
    async deleteById(raw){
        try{
            return await sequelize.models.images.destroy({
                where : {
                    id : raw.id
                },transaction: raw.transaction
            });
        }catch (err){
            throw new DatabaseException(err);
        }
    }
}